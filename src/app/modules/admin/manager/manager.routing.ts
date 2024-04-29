import { Route } from '@angular/router';
import { ManagerComponent } from './manager/manager.component';
import { ManagerProductsResolver } from './manager/manager.resolvers';
import { ManagerListComponent } from './manager/list/manager.component';

export default [
    {
        path: '',
        component: ManagerComponent,
        children: [
            {
                path: '',
                component: ManagerListComponent,
                resolve: {
                    products: ManagerProductsResolver,
                },
            },
        ],
    },
];
