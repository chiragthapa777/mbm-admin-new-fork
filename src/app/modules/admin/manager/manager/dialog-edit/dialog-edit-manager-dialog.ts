import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BuildingService } from 'app/modules/admin/building/building/building.service';
import { SharedModule } from 'app/shared/shared.module';
import {
    Observable,
    ReplaySubject,
    Subject,
    debounceTime,
    filter,
    map,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { ManagerService } from '../manager.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PermissionNamePipe } from 'app/pipes/PermissionNamePipe';
//
export interface Building {
    addressId: string;
    address: string;
}
//

@Component({
    selector: 'inventory-list',
    templateUrl: './dialog-edit-manager-dialog.html',
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
export class DialogEditManagerDialog {
    @ViewChild('fileInput') el: ElementRef;
    contactForm: FormGroup;
    manager: any;
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
        private dialogRef: MatDialogRef<DialogEditManagerDialog>,
        private _formBuilder: FormBuilder,
        private _managerService: ManagerService,
        private _buildingService: BuildingService
    ) {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.manager = this.data['data'] || null;
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
            role: ['Manager'],
            // manager: ['', [Validators.required]],
        });
        if (this.type === 'edit') {
            this.contactForm.patchValue({
                username: this.manager.userLogin,
                user_email: this.manager.userEmail,
                first_name: this.manager.firstName,
                last_name: this.manager.lastName,
                // state: this.manager.state,
                // city: this.manager.city,
                // building: this.manager.building,
                // zipcode: this.manager.zipcode,
                apartment: this.manager.apartment,
            });
            this.contactForm.get('username').disable();
            this.contactForm.get('user_email').disable();
        }

        this.bankServerSideFilteringCtrl.valueChanges
            .pipe(
                filter((search) => !!search),
                tap(() => (this.searching = true)),
                takeUntil(this._onDestroy),
                debounceTime(200),
                switchMap((search) => this.getFilteredBanks(search)),
                // delay(500),
                takeUntil(this._onDestroy)
            )
            .subscribe(
                (filteredBuildings) => {
                    this.searching = false;
                    this.filteredServerSideBuildings.next(filteredBuildings);
                },
                (error) => {
                    // no errors in our simulated example
                    this.searching = false;
                    // handle error...
                }
            );

        this._buildingService.getBuildingOptions().subscribe((res) => {
            this.pickerInitialData = res;
            this.stateOptions = this.pickerInitialData['state_option'];
            // this.buildingOptions = Object.keys(
            //     this.pickerInitialData['building_option']
            // ).map(key => ({
            //     groupName: key,
            //     building: this.pickerInitialData['building_option'][key].map(
            //         d => ({ value: d })
            //     ),
            // }));
            if (this.type === 'edit') {
                this.contactForm.get('state').setValue(this.manager.state);
                this.contactForm.get('city').setValue(this.manager.city);
                this.contactForm.get('zipcode').setValue(this.manager.zipcode);
                this.contactForm
                    .get('building')
                    .setValue(this.manager.building);
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

    onFileUploadIcon(path): void {
        console.log(path, 'IMAGE RETURNED');
        this.contactForm.get('icon').setValue(path);
        this.contactForm.get('icon').updateValueAndValidity();
        this.manager.icon = path;
    }
    onFileUploadCover(path): void {
        console.log(path, 'IMAGE RETURNED');
        this.contactForm.get('cover').setValue(path);
        this.contactForm.get('cover').updateValueAndValidity();
        this.manager.cover = path;
    }

    saveClicked(): void {
        if (this.type === 'edit') {
            this._managerService.updateProduct(
                this.manager.id,
                this.contactForm.value
            );
        }
        if (this.type === 'new') {
            this._managerService.createProduct(this.contactForm.value);
        }
        this.dialogRef.close({ name: 'ss' });
    }

    someMethod(a): void {
        console.log('🚀 ~ DialogEditManagerDialog ~ someMethod ~ a:', a);
    }

    getFilteredBanks(search: string): Observable<Building[]> {
        // return this.http.get<BankType[]>(url, { params: { search } });

        return this._buildingService.getProducts(1, 10, '', '', search).pipe(
            map((response: any) => response.data) // Extracting only the buildings from the response
        );
    }
}
