import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppConfigService } from '@service/appconfigservice';

@Component({
    templateUrl: './uikit.component.html',
    styleUrls: ['uikit.component.scss'],
    standalone: false
})
export class UIKitComponent {
    private configService = inject(AppConfigService);
    private titleService = inject(Title);
    private metaService = inject(Meta);

    subscription: Subscription;
    constructor() {
        this.titleService.setTitle('UI Kit - PrimeNG');
        this.metaService.updateTag({ name: 'description', content: 'PrimeNG Angular UI Kit' });
    }

    get isDarkMode(): boolean {
        return this.configService.config().darkMode;
    }
}
