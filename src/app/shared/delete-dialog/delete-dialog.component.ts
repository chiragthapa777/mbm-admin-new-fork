import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-example',
    templateUrl: 'delete-dialog.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class ExampleDialogComponent {
    basicInfoForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ExampleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.basicInfoForm = this._formBuilder.group({
            name: ['', [Validators.required]],
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
