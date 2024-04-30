import { TicketPendingListComponent } from './ticket-pending/list/ticket-pending.component';
import { TicketPendingComponent } from './ticket-pending/ticket-pending.component';
import { TicketPendingProductsResolver } from './ticket-pending/ticket-pending.resolvers';

export default [
    {
        path: '',
        component: TicketPendingComponent,
        children: [
            {
                path: '',
                component: TicketPendingListComponent,
                resolve: {
                    items: TicketPendingProductsResolver,
                },
            },
        ],
    },
];
