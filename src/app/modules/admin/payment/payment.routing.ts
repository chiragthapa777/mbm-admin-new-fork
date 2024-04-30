import { PaymentListComponent } from './payment/list/payment.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentProductsResolver } from './payment/payment.resolvers';

export default [
    {
        path: '',
        component: PaymentComponent,
        children: [
            {
                path: '',
                component: PaymentListComponent,
                resolve: {
                    items: PaymentProductsResolver,
                },
            },
        ],
    },
];
