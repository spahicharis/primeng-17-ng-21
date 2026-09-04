import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'templates',
    templateUrl: './templates.component.html',
    standalone: false
})
export class TemplatesComponent {
    private titleService = inject(Title);
    private metaService = inject(Meta);

    constructor() {
        this.titleService.setTitle('Angular Application Templates - PrimeNG');
        this.metaService.updateTag({ name: 'description', content: 'PrimeNG Angular application templates.' });
    }
}
