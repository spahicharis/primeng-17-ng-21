import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation, inject } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { AppConfigService } from '../../service/appconfigservice';

@Component({
    selector: 'template-features',
    template: `
        <div class="template-features">
          @if (displayType === 'horizontal') {
            <div class="template-features-horizontal-wrapper">
              <div class="template-features-horizontal">
                @for (feature of featuresData; track feature) {
                  <div class="template-features-horizontal-card">
                    <div class="template-features-horizontal-card-top">
                      <img [src]="isDarkMode ? feature.darkSrc || feature.src : feature.src" [alt]="feature.title" />
                    </div>
                    <div class="template-features-horizontal-card-bottom">
                      <h5 class="template-features-horizontal-card-bottom-title">{{ feature.title }}</h5>
                      <p class="template-features-horizontal-card-bottom-description">{{ feature.description }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="template-features-vertical-wrapper">
              <div class="template-features-vertical">
                @for (_ of [].constructor(2); track _; let i = $index) {
                  <div class="template-features-vertical-col">
                    @for (data of i === 0 ? firstColumnData : secondColumnData; track data; let j = $index) {
                      <div class="template-features-vertical-card">
                        <div class="template-features-vertical-card-image">
                          <img [src]="isDarkMode ? data.darkSrc || data.src : data.src" [alt]="data.title" />
                        </div>
                        <h2>{{ data.title }}</h2>
                        <p>{{ data.description }}</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TemplateFeatures {
    private configService = inject(AppConfigService);

    @Input() displayType;

    @Input() featuresData;

    firstColumnData;

    secondColumnData;

    get isDarkMode(): boolean {
        return this.configService.config().darkMode;
    }

    ngOnInit() {
        if (this.featuresData) {
            this.firstColumnData = this.featuresData.slice(0, Math.ceil(this.featuresData.length / 2));
            this.secondColumnData = this.featuresData.slice(Math.ceil(this.featuresData.length / 2));
        }
    }
}

@NgModule({
    imports: [CommonModule, SharedModule],
    exports: [TemplateFeatures, SharedModule],
    declarations: [TemplateFeatures]
})
export class TemplateFeaturesModule {}
