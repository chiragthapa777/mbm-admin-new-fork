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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';
import { SharedModule } from 'app/shared/shared.module';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { BuildingNotificationService } from '../building-notification.service';
import {
    BuildingNotification,
    BuildingNotificationPagination,
} from '../building-notification.types';
import { NotificationFormDialog } from './dialog-edit/notification-dialog';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { PermissionPipe } from 'app/pipes/PermissionPipe';

@Component({
    selector: 'building-notification-list',
    templateUrl: './building-notification.component.html',
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
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        PermissionPipe,
    ],
})
export class BuildingNotificationListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    items$: Observable<BuildingNotification[]>;

    categories: BuildingNotification[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: BuildingNotificationPagination;
    itemsCount: number = 0;
    itemsTableColumns: string[] = ['address', 'date', 'message', 'action'];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: BuildingNotification | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _notificationService: BuildingNotificationService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(NotificationFormDialog, {
            // height: '90%',
            width: '40%',
            data: { data: {}, type: 'add' },
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    openEditDialog(element): void {
        const dialogRef = this.dialog.open(NotificationFormDialog, {
            // height: '90%',
            width: '40%',
            data: { data: element, type: 'edit' },
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the pagination
        this._notificationService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: BuildingNotificationPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the items
        this.items$ = this._notificationService.items$;
        this._notificationService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: BuildingNotification[]) => {
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
                    return this._notificationService.getProducts(
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

    delete(Update, element: BuildingNotification): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '250px',
            data: { animal: 'delete' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'delete') {
                this._notificationService
                    .deleteNotification(element.id)
                    .subscribe((res) => {
                        this._snackBar.open(
                            'Notification deleted successfully',
                            '',
                            { duration: 1000 }
                        );
                    });
            }
        });
    }

    view(Update, element: BuildingNotification) {}

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
