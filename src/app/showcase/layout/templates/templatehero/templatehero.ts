import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { TemplateHeroLightModule } from './templateherolight';
import { TemplateHeroRectangleModule } from './templateherorectangle';

@Component({
    selector: 'template-hero',
    template: `
        <div class="template-hero">
          @if (!!templateHeroData?.pattern) {
            <img class="template-hero-pattern" width="1344" [src]="templateHeroData.pattern" alt="Template Hero Pattern" priority />
          }
          @if (!!templateHeroData?.light) {
            <template-hero-light></template-hero-light>
          }
          @if (!!templateHeroData?.rectangle) {
            <template-hero-rectangle></template-hero-rectangle>
          }
          <div class="template-hero-card">
            <div class="template-hero-card-logo"><ng-container *ngComponentOutlet="templateLogo"></ng-container></div>
            <p>{{ templateHeroData?.description }}</p>
            <div class="template-hero-card-buttons">
              <a [href]="templateHeroData?.liveHref" target="_blank" class="template-hero-card-buttons-btn1 p-button"> Live Demo </a>
              <a [href]="templateHeroData?.storeHref ?? 'https://www.primefaces.org/store/'" target="_blank" class="template-hero-card-buttons-btn2 p-button">
                {{ templateHeroData?.free ? 'Source Code' : 'Buy Now' }}
              </a>
            </div>
            <div class="template-hero-card-links ">
              <a [href]="templateHeroData?.supportHref ?? 'https://github.com/orgs/primefaces/discussions/categories/primeng-templates'" target="_blank">
                <i class="pi pi-github " style="font-size: 1rem;"></i>
                <span>{{ templateHeroData?.free ? 'Open Issues' : 'Community' }}</span>
              </a>
              <a [href]="templateHeroData?.docHref" target="_blank">
                <i class="pi pi-book " style="font-size: 1rem;"></i>
                <span>Documentation</span>
              </a>
            </div>
          </div>
          @if (!!templateHeroData?.dashboard1) {
            <img class="template-hero-dashboard1" eager [src]="templateHeroData?.dashboard1" alt="Template Dashboard Image 1" />
          }
          @if (!!templateHeroData?.dashboard2) {
            <img class="template-hero-dashboard2" eager [src]="templateHeroData?.dashboard2" alt="Template Dashboard Image 2" />
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrl: '../../../pages/templates/learnmore/learnmore.scss',
    standalone: false
})
export class TemplateHero {
    @Input() templateHeroData;
    @Input() templateLogo;
}

@NgModule({
    imports: [CommonModule, SharedModule, NgOptimizedImage, TemplateHeroLightModule, TemplateHeroRectangleModule],
    exports: [TemplateHero, SharedModule],
    declarations: [TemplateHero]
})
export class TemplateHeroModule {}
