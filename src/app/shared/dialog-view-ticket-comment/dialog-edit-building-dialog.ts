import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TicketDoneService } from 'app/modules/admin/ticket-done/ticket-done/ticket-done.service';
import { SharedModule } from '../shared.module';
import { TicketCommentService } from './ticket-comment.service';
import { TicketComment } from './ticket-comment.type';
import { PermissionPipe } from 'app/pipes/PermissionPipe';
import { NgIf } from '@angular/common';

const commentsParams = {
    page: 1,
    limit: 10,
    ticketId: null,
};

@Component({
    selector: 'ticket-view',
    templateUrl: './dialog-edit-building-dialog.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        PermissionPipe,
        NgIf,
    ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DialogViewTicketDialog implements OnInit, OnDestroy {
    commentForm: FormGroup;
    ticket: any;
    type: string;
    comments: TicketComment[] = [];
    commentsPaginationMeta = {
        currentPage: 1,
        itemsPerPage: 20,
        totalItems: 0,
        totalPages: 0,
    };
    commentsParams = commentsParams;
    commentAddLoading = false;
    commentsLoading = false;

    ticketDetails: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DialogViewTicketDialog>,
        private _paymentService: TicketDoneService,
        private _formBuilder: FormBuilder,
        private readonly ticketCommentService: TicketCommentService
    ) {}

    ngOnDestroy(): void {}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.ticket = this.data['data'] || null;
        this.commentsParams.ticketId = this.ticket.id;
        this.type = this.data['type'];
        this.commentForm = this._formBuilder.group({
            message: ['', [Validators.required]],
        });
        this.getComment(true);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    saveClicked() {
        this._paymentService.addComment({
            message: 'Ticket needs to be fixed asap.',
            ticket: this.ticket.id,
        });
    }

    getComment(add: boolean): void {
        this.commentsLoading = true;
        this._changeDetectorRef.markForCheck();
        this.ticketCommentService.getComments(this.commentsParams).subscribe({
            next: (value) => {
                if (add) {
                    this.comments = [...this.comments, ...value.data];
                } else {
                    this.comments = value.data;
                }
                this.commentsPaginationMeta = value.meta;
            },
            complete: () => {
                this.commentsLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            error: (e) => {},
        });
    }

    addComment(): void {
        this.commentForm.markAllAsTouched();
        if (!this.commentForm.valid) {
            return;
        }
        this.commentAddLoading = true;
        this._changeDetectorRef.markForCheck();
        this.ticketCommentService
            .addComment({ ...this.commentForm.value, ticket: this.ticket.id })
            .subscribe({
                next: () => {
                    this.commentForm.reset();
                    this.commentsParams = commentsParams;
                    this.getComment(false);
                },
                complete: () => {
                    this.commentAddLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
            });
    }

    loadMoreComments(): void {
        this.commentsParams.page += 1;
        this.getComment(true);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get hasMoreComment(): boolean {
        return (
            this.commentsParams.page < this.commentsPaginationMeta.totalPages
        );
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-function-return-type
    get textareaContent() {
        return this.commentForm.get('textareaField').value ?? '';
    }
}
