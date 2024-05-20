import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';
import { BuildingDoc } from 'app/modules/admin/building-doc/building-doc/building-doc.types';
import { PermissionPipe } from 'app/pipes/PermissionPipe';
import { AddDocDialog } from 'app/shared/add-docs/add-doc-dialog';
import { SharedModule } from 'app/shared/shared.module';
import { ViewDocDialog } from 'app/shared/view-docs/view-doc-dialog';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { UserDocService } from '../user-doc.service';
import { UserDoc, UserDocPagination } from '../user-doc.types';

@Component({
    selector: 'user-doc-list',
    templateUrl: './user-doc.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        SharedModule,
        PermissionPipe,
    ],
})
export class UserDocListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    items$: Observable<UserDoc[]>;

    categories: UserDoc[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: UserDocPagination;
    itemsCount: number = 0;
    itemsTableColumns: string[] = [
        'address',
        'date',
        'message',
        'documents',
        'action',
    ];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: UserDoc | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _paymentService: UserDocService,
        public dialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the pagination
        this._paymentService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: UserDocPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the items
        this.items$ = this._paymentService.items$;
        this._paymentService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: UserDoc[]) => {
                // Update the counts
                this.itemsCount = items.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // If the user changes the sort order...
        this._sort.sortChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((sort) => {
                // Reset back to the first page
                this._paginator.pageIndex = 0;
                this._sort.active = sort.active;
                this._sort.direction = sort.direction;

                // Close the details
            });

        // Get items if sort or page changes
        merge(this._sort.sortChange, this._paginator.page)
            .pipe(
                switchMap(() => {
                    this.isLoading = true;
                    return this._paymentService.getProducts(
                        this._paginator.pageIndex + 1,
                        this._paginator.pageSize,
                        this._sort.active,
                        this._sort.direction
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    view(Update, element: BuildingDoc) {
        const dialogRef = this.dialog.open(ViewDocDialog, {
            width: '630px',
            data: { data: element['documents'], type: 'user' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            return this._paymentService.getProducts(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            );
        });
    }

    openEditDialog(element) {
        const dialogRef = this.dialog.open(AddDocDialog, {
            width: '40%',
            data: { data: element['id'], type: 'user' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            return this._paymentService.getProducts(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            );
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param payment
     */
    trackByFn(index: number, payment: any): any {
        return payment.id || index;
    }
}
