import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { PermissionGuard } from './core/auth/guards/permission.guard';
import { PERMISSION_ACTION, PERMISSION_SUBJECT } from './enums/permission.enum';
import { NoPermissionComponent } from './components/no-permission/no-permission.component';
import { AuthRedirectComponent } from './components/auth-redirect/auth-redirect.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'auth-redirect' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'auth-redirect',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'auth-redirect',
                component: AuthRedirectComponent,
            },
            {
                path: 'admin',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.ADMIN,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/admin/admin.routing'),
            },
            {
                path: 'manager',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.MANAGER,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/manager/manager.routing'),
            },
            {
                path: 'building',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.BUILDING,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/building/building.routing'),
            },
            {
                path: 'bdocs',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.BUILDING_DOC,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import(
                        'app/modules/admin/building-doc/building-doc.routing'
                    ),
            },
            {
                path: 'notification',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.NOTIFICATION,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import(
                        'app/modules/admin/building-notification/building-notification.routing'
                    ),
            },
            {
                path: 'payment',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.PAYMENT,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/payment/payment.routing'),
            },
            {
                path: 'ticket0',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.TICKET,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import(
                        'app/modules/admin/ticket-pending/ticket-pending.routing'
                    ),
            },
            {
                path: 'ticket1',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.TICKET,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/ticket-done/ticket-done.routing'),
            },
            {
                path: 'user',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.USER,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/user/user.routing'),
            },
            {
                path: 'udocs',
                canActivate: [PermissionGuard],
                data: {
                    permission: [
                        {
                            subject: PERMISSION_SUBJECT.USER_DOC,
                            actions: [PERMISSION_ACTION.READ],
                        },
                    ],
                },
                loadChildren: () =>
                    import('app/modules/admin/user-doc/user-doc.routing'),
            },
        ],
    },
    {
        path: 'no-permission',
        component: NoPermissionComponent,
    },
];
