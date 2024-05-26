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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/core/user/user.types';
import { UserAuthService } from 'app/services/user.auth.service';
import { SharedModule } from 'app/shared/shared.module';
import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { DialogEditManagerDialog } from '../dialog-edit/dialog-edit-manager-dialog';
import { ManagerService } from '../manager.service';
import { Manager, ManagerPagination } from '../manager.types';
import { PermissionEditDialog } from '../permission-edit-dialog.html/permission-edit-dialog';
import { PermissionPipe } from 'app/pipes/PermissionPipe';

@Component({
    selector: 'manager-list',
    templateUrl: './manager.component.html',
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
        MatCheckboxModule,
        PermissionPipe,
    ],
})
export class ManagerListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    isAdmin: boolean = false;

    items$: Observable<Manager[]>;

    categories: Manager[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: ManagerPagination;
    itemsCount: number = 0;
    itemsTableColumns: string[] = ['username', 'name', 'email', 'action'];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: Manager | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _adminService: ManagerService,
        public dialog: MatDialog,
        public userAuthService: UserAuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.isLoading = true;

        this.userAuthService
            .getUser$()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.isAdmin = this.userAuthService.isAdmin();
            });

        // Get the pagination
        this._adminService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ManagerPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the items
        this.items$ = this._adminService.items$;
        this._adminService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Manager[]) => {
                this.isLoading = false;

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
        // If the admin changes the sort order...
        if (this._sort) {
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((sort: Sort) => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                    this._sort.active = sort.active;
                    this._sort.direction = sort.direction;
                    // Close the details
                });
        }

        if (this._sort && this._paginator) {
            // Get items if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._adminService.getProducts(
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

    delete(Update, element: Manager) {
        // console.log(Update, element);
        // let dialogRef = this.dialog.open(ExampleDialogComponent, {
        //     width: '250px',
        //     data: { animal: '' },
        // });
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('The dialog was closed', result);
        //     // this.animal = result;
        //     this._adminService.deleteProduct(element.id);
        // });
    }

    view(Update, element: Manager) {}

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
     * @param admin
     */
    trackByFn(index: number, admin: any): any {
        return admin.id || index;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    openDialog() {
        const dialogRef = this.dialog.open(DialogEditManagerDialog, {
            width: '40%',
            data: { data: {}, type: 'new' },
        });

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log(JSON.stringify(result, null, '\t'));
        // });
    }

    openEditDialog(element): void {
        const dialogRef = this.dialog.open(DialogEditManagerDialog, {
            panelClass: 'responsive-dialog',
            data: { data: element, type: 'edit' },
        });

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log(JSON.stringify(result, null, '\t'));
        // });
    }

    openPermissionEditDialog(element: User): void {
        const dialogRef = this.dialog.open(PermissionEditDialog, {
            height: 'auto',
            panelClass: 'responsive-dialog',
            data: { userId: element.id },
        });

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log(JSON.stringify(result, null, '\t'));
        // });
    }
}
