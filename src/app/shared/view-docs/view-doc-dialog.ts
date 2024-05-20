import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BuildingDocService } from 'app/modules/admin/building-doc/building-doc/building-doc.service';
import { BuildingDoc } from 'app/modules/admin/building-doc/building-doc/building-doc.types';
import { SharedModule } from '../shared.module';
import { PermissionPipe } from 'app/pipes/PermissionPipe';

@Component({
    selector: 'inventory-list',
    templateUrl: './view-doc-dialog.html',
    styleUrls: ['./view-doc-dialog.scss'],
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
        PermissionPipe,
    ],
})
export class ViewDocDialog {
    @ViewChild('fileInput') el: ElementRef;
    category: BuildingDoc;

    files: [];
    type;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _categoryService: BuildingDocService,
        private dialogRef: MatDialogRef<ViewDocDialog>
    ) {}

    ngOnInit(): void {
        this.files = this.data['data'] || null;
        this.type = this.data['type'];
    }

    deleteFile(file) {
        this._categoryService.deleteProduct(file['id'], this.type);
        this.dialogRef.close({ name: 'ss' });
    }
}
