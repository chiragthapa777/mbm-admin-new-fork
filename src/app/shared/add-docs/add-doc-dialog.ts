import { HttpClient } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BuildingDocService } from 'app/modules/admin/building-doc/building-doc/building-doc.service';
import { SharedModule } from '../shared.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'inventory-list',
    templateUrl: './add-doc-dialog.html',
    styleUrls: ['./add-doc-dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        SharedModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class AddDocDialog {
    @ViewChild('fileInput') el: ElementRef;
    contactForm: FormGroup;
    category: any;
    type: string;
    fileName = '';
    file: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<AddDocDialog>,
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private buildingDocService: BuildingDocService
    ) {}

    ngOnInit(): void {
        this.category = this.data['data'] || null;
        console.log(this.data['addressId']);

        this.type = this.data['type'];
        this.contactForm = this._formBuilder.group({
            description: [''],
        });
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];

        this.fileName = file.name;
        this.file = file;
    }

    saveClicked() {
        const formData = new FormData();

        formData.append('file', this.file);
        formData.append('type', this.type);
        formData.append('description', this.contactForm.value.description);
        formData.append('idCrossReference', this.data['data']);
        this.buildingDocService.addDocs(formData).subscribe(() => {
            this.dialogRef.close();
        });
    }
}
