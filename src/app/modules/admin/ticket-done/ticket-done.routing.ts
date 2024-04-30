import { TicketDoneListComponent } from './ticket-done/list/ticket-done.component';
import { TicketDoneComponent } from './ticket-done/ticket-done.component';
import { TicketDoneProductsResolver } from './ticket-done/ticket-done.resolvers';

export default [
    {
        path: '',
        component: TicketDoneComponent,
        children: [
            {
                path: '',
                component: TicketDoneListComponent,
                resolve: {
                    items: TicketDoneProductsResolver,
                },
            },
        ],
    },
];
