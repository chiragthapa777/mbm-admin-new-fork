import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'ticket-done',
    templateUrl: './ticket-done.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterModule],
})
export class TicketDoneComponent {
    /**
     * Constructor
     */
    constructor() {}
}
