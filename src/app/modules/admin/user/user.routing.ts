import { Route } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserProductsResolver } from './user/user.resolvers';
import { UserListComponent } from './user/list/user.component';

export default [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                component: UserListComponent,
                resolve: {
                    items: UserProductsResolver,
                },
            },
        ],
    },
];
