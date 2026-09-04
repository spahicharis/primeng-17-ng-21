import { Directive, ViewContainerRef, inject } from '@angular/core';

@Directive({
    selector: '[pDynamicDialogContent]',
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class DynamicDialogContent {
    viewContainerRef = inject(ViewContainerRef);
}
