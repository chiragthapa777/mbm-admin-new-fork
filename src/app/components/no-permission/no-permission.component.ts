import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-no-permission',
    templateUrl: './no-permission.component.html',
    styleUrls: ['./no-permission.component.scss'],
})
export class NoPermissionComponent {
    constructor(
        private authService: AuthService,
        private _router: Router,
        private location: Location
    ) {}
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    signOut() {
        this.authService.signOut();
        this._router.navigate(['sign-in']);
    }

    goBack(): void {
        this.location.back();
    }
}
