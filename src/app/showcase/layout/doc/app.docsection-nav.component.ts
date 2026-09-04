import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils } from 'primeng/utils';
import { Subscription } from 'rxjs';
import { Doc } from 'src/app/showcase/domain/doc';

@Component({
    selector: 'app-docsection-nav',
    template: ` @if (docs && docs.length) {
  <ul #nav class="doc-section-nav" [ngClass]="{ hidden: visible }">
    @for (doc of docs; track doc; let i = $index) {
      <li class="navbar-item" [ngClass]="{ 'active-navbar-item': activeId === doc.id }">
        @if (!doc.isInterface) {
          <div class="navbar-item-content">
            <button class="px-link" (click)="onButtonClick($event, doc)">{{ doc.label }}</button>
          </div>
          <ng-container>
            @if (doc.children) {
              <ul>
                @for (child of doc.children; track child; let isFirst = $first) {
                  <li class="navbar-item" [ngClass]="{ 'active-navbar-item': activeId === child.id }">
                    <div class="navbar-item-content">
                      <button class="px-link" (click)="onButtonClick($event, child)">
                        {{ child.label }}
                      </button>
                    </div>
                  </li>
                }
              </ul>
            }
          </ng-container>
        }
      </li>
    }
  </ul>
}`,
    standalone: false
})
export class AppDocSectionNavComponent implements OnInit, OnDestroy {
    private document = inject<Document>(DOCUMENT);
    private platformId = inject(PLATFORM_ID);
    private location = inject(Location);
    private zone = inject(NgZone);
    private renderer = inject(Renderer2);
    private router = inject(Router);

    @Input() docs!: Doc[];

    subscription!: Subscription;

    scrollListener!: any;

    _activeId: any;

    get activeId() {
        return this._activeId;
    }
    set activeId(val: string) {
        if (val !== this._activeId) {
            this._activeId = val;
        }
    }
    isScrollBlocked: boolean = false;

    topbarHeight: number = 0;

    scrollEndTimer!: any;

    @ViewChild('nav') nav: ElementRef;

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const hash = window.location.hash.substring(1);
            const hasHash = ObjectUtils.isNotEmpty(hash);
            const id = hasHash ? hash : ((this.docs && this.docs[0]) || {}).id;

            this.activeId = id;
            hasHash &&
                setTimeout(() => {
                    this.scrollToLabelById(id);
                }, 250);

            this.zone.runOutsideAngular(() => {
                this.scrollListener = this.renderer.listen(this.document, 'scroll', (event: any) => {
                    this.onScroll();
                });
            });
        }
    }

    scrollCurrentUrl() {
        const hash = window.location.hash.substring(1);
        const hasHash = ObjectUtils.isNotEmpty(hash);
        const id = hasHash ? hash : (this.docs[0] || {}).id;

        this.activeId = id;
        hasHash &&
            setTimeout(() => {
                this.scrollToLabelById(id);
            }, 1);
    }

    getLabels() {
        return [...Array.from(this.document.querySelectorAll(':is(h1,h2,h3).doc-section-label'))].filter((el: any) => DomHandler.isVisible(el));
    }

    onScroll() {
        if (isPlatformBrowser(this.platformId) && this.nav) {
            if (!this.isScrollBlocked) {
                this.zone.run(() => {
                    if (typeof document !== 'undefined') {
                        const labels = this.getLabels();
                        const windowScrollTop = DomHandler.getWindowScrollTop();

                        labels.forEach((label) => {
                            const { top } = DomHandler.getOffset(label);
                            const threshold = this.getThreshold(label);

                            if (top - threshold <= windowScrollTop) {
                                const link = DomHandler.findSingle(label, 'a');
                                this.activeId = link.id;
                            }
                        });
                    }
                });
            }

            clearTimeout(this.scrollEndTimer);
            this.scrollEndTimer = setTimeout(() => {
                this.isScrollBlocked = false;

                const activeItem = DomHandler.findSingle(this.nav.nativeElement, '.active-navbar-item');

                activeItem && activeItem.scrollIntoView({ block: 'nearest', inline: 'start' });
            }, 50);
        }
    }

    onButtonClick(event, doc) {
        this.activeId = doc.id;
        setTimeout(() => {
            this.scrollToLabelById(doc.id);
            this.isScrollBlocked = true;
        }, 1);

        event.preventDefault();
    }

    getThreshold(label) {
        if (typeof document !== undefined) {
            if (!this.topbarHeight) {
                const topbar = DomHandler.findSingle(document.body, '.layout-topbar');

                this.topbarHeight = topbar ? DomHandler.getHeight(topbar) : 0;
            }
        }

        return this.topbarHeight + DomHandler.getHeight(label) * 3.5;
    }

    scrollToLabelById(id) {
        if (typeof document !== undefined) {
            const label = document.getElementById(id);
            this.location.go(this.location.path().split('#')[0] + '#' + id);
            setTimeout(() => {
                label && label.parentElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }, 1);
        }
    }

    ngOnDestroy() {
        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
    }
}
