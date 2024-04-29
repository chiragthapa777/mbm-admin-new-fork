/* eslint-disable @typescript-eslint/naming-convention */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Permission } from 'app/core/user/user.types';
import { PermissionSubjectArray } from 'app/enums/permission.enum';
import { PermissionNamePipe } from 'app/pipes/PermissionNamePipe';
import { PermissionPipe } from 'app/pipes/PermissionPipe';
import { PermissionService } from 'app/services/permission.service';
import { SharedModule } from 'app/shared/shared.module';
import { Subject } from 'rxjs';
@Component({
    selector: 'permission-edit-dialog',
    templateUrl: './permission-edit-dialog.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SharedModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        PermissionPipe,
        PermissionNamePipe,
    ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PermissionEditDialog implements OnInit, OnDestroy {
    _onDestroy = new Subject<void>();
    userId: number | null = null;
    permissions: Permission[] = [];
    permissionsLoading = false;
    saveLoading = false;
    permissionForm: FormGroup;
    addForm: FormGroup;
    permissionSubjects = PermissionSubjectArray;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<PermissionEditDialog>,
        private _formBuilder: FormBuilder,
        private permissionService: PermissionService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.userId = this.data?.userId || null;
        this.permissionForm = this._formBuilder.group({
            permissionsArray: this._formBuilder.array([]),
            addObject: this._formBuilder.group({
                userId: [this.userId],
                subject: [null, Validators.required],
                ALL_ACTION: [false],
                READ_ACTION: [false],
                WRITE_ACTION: [false],
                UPDATE_ACTION: [false],
                DELETE_ACTION: [false],
                EXPORT_ACTION: [false],
                IMPORT_ACTION: [false],
                DOWNLOAD_ACTION: [false],
                UPLOAD_ACTION: [false],
            }),
        });
        if (!this.userId) {
            return this.dialogRef.close();
        }
        this.getPermissions();
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.permissions = [];
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get items(): FormArray {
        return this.permissionForm.get('permissionsArray') as FormArray;
    }

    reduceSubjects(): void {
        const existingSubject: string[] =
            this.permissionForm?.value?.permissionsArray?.map((d) => d.subject);
        this.permissionSubjects = PermissionSubjectArray.filter(
            (sub) => !existingSubject.includes(sub)
        );
        this._changeDetectorRef.markForCheck();
    }

    loadPermissionInForm(): void {
        this.permissionForm.setControl(
            'permissionsArray',
            this._formBuilder.array([])
        );
        this.permissions.forEach((permission) => {
            const permissionGroup = this._formBuilder.group({
                id: [permission.id, Validators.required],
                stamp: [permission.stamp, Validators.required],
                userId: [permission.userId, Validators.required],
                subject: [permission.subject, Validators.required],
                ALL_ACTION: [permission.ALL_ACTION],
                READ_ACTION: [permission.READ_ACTION],
                WRITE_ACTION: [permission.WRITE_ACTION],
                UPDATE_ACTION: [permission.UPDATE_ACTION],
                DELETE_ACTION: [permission.DELETE_ACTION],
                DOWNLOAD_ACTION: [permission.DOWNLOAD_ACTION],
                EXPORT_ACTION: [permission.EXPORT_ACTION],
                IMPORT_ACTION: [permission.IMPORT_ACTION],
                UPLOAD_ACTION: [permission.UPLOAD_ACTION],
            });

            // Push the permissionGroup to the FormArray
            (this.permissionForm.get('permissionsArray') as FormArray).push(
                permissionGroup
            );
        });
        this._changeDetectorRef.markForCheck();
    }

    getPermissions(): void {
        this.permissionsLoading = true;
        this._changeDetectorRef.markForCheck();
        this.permissionService
            .getPermissions({ userId: this.userId })
            .subscribe({
                next: (value) => {
                    this.permissions = value;
                    this.loadPermissionInForm();
                    this.reduceSubjects();
                },
                complete: () => {
                    this.permissionsLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
            });
    }

    saveChanges(): void {
        this.saveLoading = true;
        this._changeDetectorRef.markForCheck();
        if (
            this.permissionForm.get('addObject').dirty &&
            this.permissionForm.get('addObject').valid
        ) {
            this.addPermission();
        }
        if (
            this.permissionForm.get('permissionsArray').dirty &&
            this.permissionForm.get('permissionsArray').valid
        ) {
            this.permissionService
                .updatePermissionBulk(
                    this.permissionForm.value.permissionsArray
                )
                .subscribe({
                    next: (value) => {
                        this.permissionForm.get('permissionsArray').reset();
                        this.getPermissions();
                        // this.dialogRef.close();
                    },
                    complete: () => {
                        this.saveLoading = false;
                        this._changeDetectorRef.markForCheck();
                    },
                });
        }
    }

    addPermission(): void {
        this.saveLoading = true;
        this._changeDetectorRef.markForCheck();
        this.permissionService
            .addPermissions(this.permissionForm.value.addObject)
            .subscribe({
                next: (value) => {
                    // this.dialogRef.close();
                    this.permissionForm.get('addObject').reset();
                    this.permissionForm
                        .get('addObject')
                        .get('userId')
                        .setValue(this.userId);
                    this.getPermissions();
                },
                complete: () => {
                    this.saveLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
            });
    }
}
