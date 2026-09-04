import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, PLATFORM_ID, inject } from '@angular/core';

@Component({
    selector: 'p-deferred-demo',
    imports: [],
    template: `
        @if (!visible) {
            <div class="card">
                <div class="deferred-demo-loading"></div>
            </div>
        } @else {
            <ng-content />
        }
    `,
    styleUrl: './deferreddemo.scss'
})
export class DeferredDemo implements OnInit {
    el = inject(ElementRef);
    private platformId = inject(PLATFORM_ID);

    visible: boolean = false;

    observer = null;

    timeout = null;

    @Input() options: any;

    @Output() load: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.observer = new IntersectionObserver(([entry]) => {
                clearTimeout(this.timeout);

                if (entry.isIntersecting) {
                    this.timeout = setTimeout(() => {
                        this.visible = true;
                        this.observer.unobserve(this.el.nativeElement);
                        this.load.emit();
                    }, 350);
                }
            }, this.options);

            this.observer.observe(this.el.nativeElement);
        }
    }

    ngOnDestroy() {
        if (!this.visible && this.el.nativeElement) {
            this.observer?.unobserve(this.el.nativeElement);
        }
        clearTimeout(this.timeout);
    }
}
