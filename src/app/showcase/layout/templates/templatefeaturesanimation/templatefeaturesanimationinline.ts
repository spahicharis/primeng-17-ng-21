import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgModule, PLATFORM_ID, ViewEncapsulation, inject } from '@angular/core';
import { SharedModule } from 'primeng/api';

@Component({
    selector: 'template-features-animation-inline',
    template: `
        <div class="template-features-animation-right-inline">
          <div class="template-features-animation-right-inline-tabs">
            @for (data of inlineFeaturesData; track data; let i = $index) {
              <button
                (mouseenter)="enterCardArea(data.id)"
                (mouseleave)="leaveCardArea(data.id)"
                [class.template-features-animation-right-inline-tabs-btnActive]="data.id === selectedID"
                (click)="handleBtnClick(data.id)"
                >
                {{ data.title }}
              </button>
            }
          </div>
          <div class="template-features-animation-right-inline-image">
            <img [src]="inlineFeaturesData[selectedID - 1]?.src" alt="Animation Inline Feature Image" />
          </div>
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TemplateFeaturesAnimationInline {
    private cd = inject(ChangeDetectorRef);
    el = inject(ElementRef);
    private platformId = inject(PLATFORM_ID);

    @Input() inlineFeaturesData;

    @Input() parentHandleClick;

    @Input() parentHandleHover;

    @Input() parentID;

    @Input() inlineSeconds;

    selectedID = 1;

    hoveredID = '';

    intervalId;

    observer = null;

    timeout = null;

    options;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.observer = new IntersectionObserver(([entry]) => {
                clearTimeout(this.timeout);

                if (entry.isIntersecting) {
                    this.startInterval();
                    this.timeout = setTimeout(() => {
                        this.observer.unobserve(this.el.nativeElement);
                    }, 350);
                }
            }, this.options);

            this.observer.observe(this.el.nativeElement);
        }
    }
    handleClick(id) {
        this.selectedID = id;
    }

    handleBtnClick = (id) => {
        this.handleClick(id);
        this.parentHandleClick(id);
    };

    startInterval() {
        this.intervalId = setInterval(() => {
            this.selectedID++;
            if (this.selectedID > this.inlineFeaturesData.length) {
                this.selectedID = 1;
            }
            this.cd.markForCheck();
        }, this.inlineSeconds);
    }

    enterCardArea() {
        clearInterval(this.intervalId);
    }

    leaveCardArea() {
        this.startInterval();
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        if (this.el.nativeElement) {
            this.observer?.unobserve(this.el.nativeElement);
        }
    }
}

@NgModule({
    imports: [CommonModule, SharedModule],
    exports: [TemplateFeaturesAnimationInline, SharedModule],
    declarations: [TemplateFeaturesAnimationInline]
})
export class TemplateFeaturesAnimationInlineModule {}
