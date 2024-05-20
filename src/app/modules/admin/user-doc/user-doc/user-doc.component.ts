import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'user-doc',
    templateUrl: './user-doc.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterModule],
})
export class UserDocComponent {
    /**
     * Constructor
     */
    constructor() {}
}
