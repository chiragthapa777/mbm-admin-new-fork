import { Route } from '@angular/router';
import { BuildingComponent } from './building/building.component';
import { BuildingProductsResolver } from './building/building.resolvers';
import { BuildingListComponent } from './building/list/building.component';

export default [
    {
        path: '',
        component: BuildingComponent,
        children: [
            {
                path: '',
                component: BuildingListComponent,
                resolve: {
                    products: BuildingProductsResolver,
                },
            },
        ],
    },
];
