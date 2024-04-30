import { Route } from '@angular/router';
import { BuildingDocComponent } from './building-doc/building-doc.component';
import { BuildingDocProductsResolver } from './building-doc/building-doc.resolvers';
import { BuildingDocListComponent } from './building-doc/list/building-doc.component';

export default [
    {
        path: '',
        component: BuildingDocComponent,
        children: [
            {
                path: '',
                component: BuildingDocListComponent,
                resolve: {
                    items: BuildingDocProductsResolver,
                },
            },
        ],
    },
];
