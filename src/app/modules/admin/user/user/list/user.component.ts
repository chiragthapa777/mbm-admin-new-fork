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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../user.service';
import { User, UserPagination } from '../user.types';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { PermissionPipe } from 'app/pipes/PermissionPipe';

@Component({
    selector: 'user-list',
    templateUrl: './user.component.html',
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
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    items$: Observable<User[]>;

    categories: User[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: UserPagination;
    itemsCount: number = 0;
    itemsTableColumns: string[] = [
        'name',
        'email',
        'phone',
        'state',
        'city',
        'zipcode',
        'address',
        'building',
        'apartment',
        'action',
    ];

    searchInputControl: FormControl = new FormControl();
    selectedProduct: User | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        public dialog: MatDialog
    ) {}

    openDialog() {}

    openEditDialog(element) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the pagination
        this._userService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: UserPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the items
        this.items$ = this._userService.items$;
        this._userService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: User[]) => {
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
                this._sort.active = sort.active;
                this._sort.direction = sort.direction;
                // Reset back to the first page
                this._paginator.pageIndex = 0;

                // Close the details
            });

        // Get items if sort or page changes
        merge(this._sort.sortChange, this._paginator.page)
            .pipe(
                switchMap(() => {
                    this.isLoading = true;
                    return this._userService.getProducts(
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

    delete(Update, element: User) {

        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '250px',
            data: { animal: '' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // this.animal = result;

            this._userService.deleteProduct(element.id);
        });
    }

    view(Update, element: User) {}

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
     * @param user
     */
    trackByFn(index: number, user: any): any {
        return user.id || index;
    }
}
