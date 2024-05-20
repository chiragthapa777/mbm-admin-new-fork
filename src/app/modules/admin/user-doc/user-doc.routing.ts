import { UserDocListComponent } from './user-doc/list/user-doc.component';
import { UserDocComponent } from './user-doc/user-doc.component';
import { UserDocProductsResolver } from './user-doc/user-doc.resolvers';

export default [
    {
        path: '',
        component: UserDocComponent,
        children: [
            {
                path: '',
                component: UserDocListComponent,
                resolve: {
                    items: UserDocProductsResolver,
                },
            },
        ],
    },
];
