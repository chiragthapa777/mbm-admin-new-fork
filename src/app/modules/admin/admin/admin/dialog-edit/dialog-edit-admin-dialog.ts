import {
    ChangeDetectionStrategy,
    ElementRef,
    Inject,
    ViewChild,
} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';
import { Admin } from '../admin.types';
import { AdminService } from '../admin.service';
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'inventory-list',
    templateUrl: './dialog-edit-admin-dialog.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SharedModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class DialogEditAdminDialog {
    @ViewChild('fileInput') el: ElementRef;
    contactForm: FormGroup;
    user: User;
    type: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DialogEditAdminDialog>,
        private _formBuilder: FormBuilder,
        private _buildingService: AdminService
    ) {}

    ngOnInit(): void {
        this.user = this.data['data'] || null;
        this.type = this.data['type'];
        this.contactForm = this._formBuilder.group({
            username: [''],
            user_email: [''],
            first_name: [''],
            last_name: [''],
            phone: [''],
            role: [''],
            building: ['', [Validators.required]],
        });
        if (this.type === 'edit') {
            this.contactForm.patchValue({
                username: this.user.userLogin,
                user_email: this.user.userEmail,
                first_name: this.user.firstName,
                last_name: this.user.lastName,
                role: this.user.role,
                building: this.user.building,
                phone: this.user.phone,
            });
        } else if (this.type === 'view') {
            this.contactForm.patchValue({
                username: this.user.userLogin,
                user_email: this.user.userEmail,
                first_name: this.user.firstName,
                last_name: this.user.lastName,
                role: this.user.role,
                building: this.user.building,
                phone: this.user.phone,
            });
            this.contactForm.disable();
        }
    }

    saveClicked() {
        if (this.type === 'edit') {
            this._buildingService.updateProduct(
                this.contactForm.value.id,
                this.contactForm.value
            );
        }
        this.dialogRef.close({ name: 'ss' });
    }
}
