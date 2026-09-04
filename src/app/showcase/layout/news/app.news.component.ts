
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, afterNextRender, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import News from '../../data/news.json';
import { AppConfigService } from '@service/appconfigservice';

@Component({
    selector: 'app-news',
    templateUrl: './app.news.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, StyleClassModule]
})
export class AppNewsComponent {
    private configService = inject(AppConfigService);
    private cd = inject(ChangeDetectorRef);

    storageKey: string = 'primeng-v17';

    announcement: any;

    get isNewsActive(): boolean {
        return this.configService.state.newsActive;
    }

    hideNews() {
        this.configService.hideNews();
        const item = {
            hiddenNews: this.announcement.id
        };

        localStorage.setItem(this.storageKey, JSON.stringify(item));
    }
}
