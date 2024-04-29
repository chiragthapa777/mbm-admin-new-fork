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
import { PermissionPipe } from 'app/pipes/PermissionPipe';
import { SharedModule } from 'app/shared/shared.module';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { BuildingService } from '../building.service';
import { Building, BuildingPagination } from '../building.types';
import { DialogEditBuildingDialog } from '../dialog-edit/dialog-edit-building-dialog';

@Component({
    selector: 'building-list',
    templateUrl: './building.component.html',
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
export class BuildingListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    items$: Observable<Building[]>;

    categories: Building[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: BuildingPagination;
    itemsCount: number = 0;
    itemsTableColumns: string[] = ['sku', 'city', 'zip', 'address', 'action'];
    searchInputControl: FormControl = new FormControl();
    selectedProduct: Building | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _buildingService: BuildingService,
        public dialog: MatDialog
    ) {}

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    openDialog() {
        const dialogRef = this.dialog.open(DialogEditBuildingDialog, {
            height: '90%',
            width: '40%',
            data: { data: {}, type: 'new' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(JSON.stringify(result, null, '\t'));
        });
    }

    openEditDialog(element): void {
        const dialogRef = this.dialog.open(DialogEditBuildingDialog, {
            height: '90%',
            width: '40%',
            data: { data: element, type: 'edit' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(JSON.stringify(result, null, '\t'));
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.isLoading = true;
        // Get the pagination
        this._buildingService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: BuildingPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the items
        this.items$ = this._buildingService.items$;
        this._buildingService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Building[]) => {
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
        // If the user changes the sort order...
        if (this._sort) {
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((sort: Sort) => {
                    this._sort.active = sort.active;
                    this._sort.direction = sort.direction;
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                });
        }

        this.searchInputControl.valueChanges
            .pipe(debounceTime(1000))
            .subscribe((searchTerm) => {
                this.isLoading = true;
                this._changeDetectorRef.detectChanges();
                return this._buildingService
                    .getProducts(
                        this._paginator.pageIndex + 1,
                        this._paginator.pageSize,
                        this._sort.active,
                        this._sort.direction,
                        searchTerm || ''
                    )
                    .subscribe(() => {
                        this.isLoading = false;
                        this._changeDetectorRef.detectChanges();
                    });
            });

        // Get items if sort or page changes
        if (this._sort && this._paginator) {
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._buildingService.getProducts(
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/naming-convention
    delete(Update: any, element: Building) {
        // console.log(Update, element);
        // const dialogRef = this.dialog.open(ExampleDialogComponent, {
        //     width: '250px',
        //     data: { animal: '' },
        // });
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('The dialog was closed', result);
        //     // this.animal = result;
        //     this._buildingService.deleteProduct(element.id);
        // });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    view() {}

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
     * @param building
     */
    trackByFn(index: number, building: any): any {
        return building.id || index;
    }
}
