import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { BuildingService } from 'app/modules/admin/building/building/building.service';
import { Subject, debounceTime } from 'rxjs';
import { BuildingNotificationService } from '../../building-notification.service';
import { BuildingNotification } from '../../building-notification.types';
import { getDirtyValues } from 'app/utils/dirtyvalues';
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//
export interface Building {
    addressId: string;
    address: string;
    statename?: string;
    zipcode?: string;
    city?: string;
    statecode?: string;
}

@Component({
    selector: 'notification-form-dialog',
    templateUrl: './notification-dialog.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        SharedModule,
        MatFormFieldModule,
        MatAutocompleteModule,
    ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NotificationFormDialog {
    @ViewChild('fileInput') el: ElementRef;
    contactForm: FormGroup;
    type: string;
    building: Building[];
    notification: BuildingNotification;
    loading = false;

    _onDestroy = new Subject<void>();
    formGroup: FormGroup;

    //

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<NotificationFormDialog>,
        private _formBuilder: FormBuilder,
        private _buildingService: BuildingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private notificationService: BuildingNotificationService
    ) {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.type = this.data['type'];
        this.notification = this.data['data'] || {};
        this.initForm();
        if (this.type !== 'edit') {
            this.getBuilding();
        } else {
            this.building = [this.notification.address];
        }
    }

    initForm(): void {
        this.formGroup = this._formBuilder.group({
            address: [this.notification?.address?.addressId || null],
            building: [this.notification?.address || ''],
            message: [this.notification?.message || ''],
        });
        this.formGroup
            .get('building')
            .valueChanges.pipe(debounceTime(1000))
            .subscribe((response: any) => {
                if (typeof response === 'string') {
                    this.getBuilding(response);
                }
            });
        this.formGroup
            .get('building')
            .valueChanges.subscribe((response: Building) => {
                if (response.addressId) {
                    this.formGroup.get('address').setValue(response.addressId);
                }
            });

        if (this.type === 'edit') {
            this.formGroup.get('building').disable();
        }
    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    saveClicked(): void {
        if (this.type === 'edit') {
            const updatedValues = getDirtyValues(this.formGroup);
            if (updatedValues) {
                this.notificationService
                    .updateNotification(this.notification?.id, updatedValues)
                    .subscribe((res) => {
                        console.log(res);
                    });
            }
        }
        if (this.type === 'add') {
            this.notificationService
                .addNotification(this.formGroup.value)
                .subscribe((res) => {
                    console.log(res);
                });
        }
        this.dialogRef.close({ name: 'ss' });
    }

    onScroll(): void {
        console.log('scroll triggered');
    }

    getBuilding(search?: string): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this._buildingService.getProducts(0, 50, null, null, search).subscribe(
            (res: any) => {
                this.building = res?.data;
                this._changeDetectorRef.markForCheck();
                console.log(this.building);
            },
            () => {},
            () => {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    displayFn(building: any): string {
        return building && building.address ? building.address : '';
    }
}
