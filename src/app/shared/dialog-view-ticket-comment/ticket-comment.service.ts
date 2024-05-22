import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    PERMISSION_ACTION,
    PERMISSION_SUBJECT,
} from 'app/enums/permission.enum';
import { UserAuthService } from 'app/services/user.auth.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagination } from '../pagination.type';
import { TicketComment } from './ticket-comment.type';

@Injectable({ providedIn: 'root' })
export class TicketCommentService {
    constructor(
        private _httpClient: HttpClient,
        private userAuthService: UserAuthService,
        private route: ActivatedRoute
    ) {}

    getComments(params): Observable<Pagination<TicketComment>> {
        let url = environment.baseUrl + 'admin/ticket-comments';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/ticket-comments';
        }

        if (
            !this.userAuthService.hasHasEnoughPermission([
                {
                    subject: PERMISSION_SUBJECT.TICKET_COMMENT,
                    actions: [PERMISSION_ACTION.READ],
                },
            ])
        ) {
            return throwError(() => 'No Permission');
        }
        return this._httpClient.get<Pagination<TicketComment>>(url, {
            params,
        });
    }

    addComment(body: { message: string; ticket: number }): Observable<any> {
        let url = environment.baseUrl + 'admin/ticket-comments';
        if (this.userAuthService.isManager()) {
            url = environment.baseUrl + 'manager/ticket-comments';
        }
        if (
            !this.userAuthService.hasHasEnoughPermission([
                {
                    subject: PERMISSION_SUBJECT.TICKET_COMMENT,
                    actions: [PERMISSION_ACTION.WRITE],
                },
            ])
        ) {
            return throwError(() => 'No Permission');
        }
        return this._httpClient.post<any>(url, body);
    }
}
