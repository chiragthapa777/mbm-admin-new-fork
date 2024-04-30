import { BuildingNotificationComponent } from './building-notification/building-notification.component';
import { BuildingNotificationProductsResolver } from './building-notification/building-notification.resolvers';
import { BuildingNotificationListComponent } from './building-notification/list/building-notification.component';

export default [
    {
        path: '',
        component: BuildingNotificationComponent,
        children: [
            {
                path: '',
                component: BuildingNotificationListComponent,
                resolve: {
                    items: BuildingNotificationProductsResolver,
                },
            },
        ],
    },
];
