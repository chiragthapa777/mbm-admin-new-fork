// permission.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import {
    PERMISSION_SUBJECT,
    PermissionSubjectArrayDisplay,
} from 'app/enums/permission.enum';

@Pipe({
    name: 'permissionName',
    standalone: true,
})
export class PermissionNamePipe implements PipeTransform {
    transform(subjectName: PERMISSION_SUBJECT | string): string {
        // For demonstration purposes, always return true
        return (
            PermissionSubjectArrayDisplay.find((p) => p.name === subjectName)
                ?.displayName || subjectName
        );
    }
}
