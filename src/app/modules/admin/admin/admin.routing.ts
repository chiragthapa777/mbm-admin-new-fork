import { AdminComponent } from './admin/admin.component';
import { AdminProductsResolver } from './admin/admin.resolvers';
import { AdminListComponent } from './admin/list/admin.component';

export default [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: AdminListComponent,
                resolve: {
                    products: AdminProductsResolver,
                },
            },
        ],
    },
];
