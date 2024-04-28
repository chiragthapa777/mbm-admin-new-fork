// permission.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import {
    PERMISSION_ACTION,
    PERMISSION_SUBJECT,
} from 'app/enums/permission.enum';
import { UserAuthService } from 'app/services/user.auth.service';
@Pipe({
    name: 'permission',
    standalone: true,
})
export class PermissionPipe implements PipeTransform {
    constructor(private readonly userAuthService: UserAuthService) {}
    transform(
        subjectName: PERMISSION_SUBJECT,
        actionList: PERMISSION_ACTION[]
    ): boolean {
        // For demonstration purposes, always return true
        return this.userAuthService.hasHasEnoughPermission([
            { subject: subjectName, actions: actionList },
        ]);
    }
}
