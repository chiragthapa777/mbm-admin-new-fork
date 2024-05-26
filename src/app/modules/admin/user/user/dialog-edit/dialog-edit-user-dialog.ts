import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BuildingService } from 'app/modules/admin/building/building/building.service';
import { Building } from 'app/modules/admin/building/building/building.types';
import { PermissionNamePipe } from 'app/pipes/PermissionNamePipe';
import { SharedModule } from 'app/shared/shared.module';
import { ReplaySubject, Subject } from 'rxjs';
import { UserService } from '../user.service';
//

@Component({
    selector: 'inventory-list',
    templateUrl: './dialog-edit-user-dialog.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SharedModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        PermissionNamePipe,
    ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DialogEditUserDialog {
    @ViewChild('fileInput') el: ElementRef;
    contactForm: FormGroup;
    user: any;
    type: string;
    //
    pickerInitialData = [];

    /** control for the selected bank for server side filtering */
    bankServerSideCtrl: FormControl = new FormControl();

    /** control for filter for server side. */
    bankServerSideFilteringCtrl: FormControl = new FormControl();

    /** indicate search operation is in progress */
    searching: boolean = false;

    /** list of banks filtered after simulating server side search */
    filteredServerSideBuildings: ReplaySubject<Building[]> = new ReplaySubject<
        Building[]
    >(1);

    _onDestroy = new Subject<void>();
    selectedOption: string;

    stateOptions: any[] = [];
    cityOptions: any[] = [];
    zipOptions: any[] = [];
    buildingOptions: any[] = [];

    //

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DialogEditUserDialog>,
        private _formBuilder: FormBuilder,
        private _buildingService: BuildingService,
        private _userService: UserService
    ) {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.user = this.data['data'] || null;
        this.type = this.data['type'];
        this.contactForm = this._formBuilder.group({
            username: [''],
            user_email: [''],
            first_name: [''],
            last_name: [''],
            phone: [''],
            state: [''],
            city: [''],
            zipcode: [''],
            building: [''],
            apartment: [''],
            role: ['User'],
            // manager: ['', [Validators.required]],
        });
        if (this.type === 'edit' || this.type === 'view') {
            this.contactForm.patchValue({
                username: this.user.userLogin,
                user_email: this.user.userEmail,
                first_name: this.user.firstName,
                last_name: this.user.lastName,
                // state: this.user.state,
                // city: this.user.city,
                // building: this.user.building,
                // zipcode: this.user.zipcode,
                apartment: this.user.apartment,
            });
            this.contactForm.get('username').disable();
            this.contactForm.get('user_email').disable();
        }
        if (this.type === 'view') {
            this.contactForm.disable();
        }

        this._buildingService.getBuildingOptions().subscribe((res) => {
            this.pickerInitialData = res;
            this.stateOptions = this.pickerInitialData['state_option'];
            if (this.type === 'edit' || this.type === 'view') {
                this.contactForm.get('state').setValue(this.user.state);
                this.contactForm.get('city').setValue(this.user.city);
                this.contactForm.get('zipcode').setValue(this.user.zipcode);
                this.contactForm.get('building').setValue(this.user.building);
            }
        });

        this.contactForm.get('state').valueChanges.subscribe((value) => {
            this.cityOptions = this.pickerInitialData['city_option'][value];
            this.contactForm.get('city').setValue('');
            this.contactForm.get('zipcode').setValue('');
            this.contactForm.get('building').setValue('');
            this.zipOptions = [];
            this.buildingOptions = [];
        });

        this.contactForm.get('city').valueChanges.subscribe((value) => {
            this.zipOptions = this.pickerInitialData['zipcode_option'][value];
        });

        this.contactForm.get('zipcode').valueChanges.subscribe((value) => {
            this.buildingOptions =
                this.pickerInitialData['building_option'][value];
        });
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    saveClicked(): void {
        if (this.type === 'edit') {
            this._userService.updateProduct(
                this.user.id,
                this.contactForm.value
            );
        }
        if (this.type === 'new') {
            this._userService.createProduct(this.contactForm.value);
        }
        this.dialogRef.close({ name: 'ss' });
    }
}
