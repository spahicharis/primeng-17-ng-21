import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    templateUrl: './roadmap.component.html',
    standalone: false
})
export class RoadmapComponent {
    private titleService = inject(Title);
    private metaService = inject(Meta);

    constructor() {
        this.titleService.setTitle('Roadmap - PrimeNG');
        this.metaService.updateTag({ name: 'description', content: 'PrimeNG Roadmap' });
    }
}
