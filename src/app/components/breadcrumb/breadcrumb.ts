import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, PrimeTemplate, SharedModule } from 'primeng/api';
import { ChevronRightIcon } from 'primeng/icons/chevronright';
import { HomeIcon } from 'primeng/icons/home';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbItemClickEvent } from './breadcrumb.interface';
/**
 * Breadcrumb provides contextual information about page hierarchy.
 * @group Components
 */
@Component({
    selector: 'p-breadcrumb',
    template: `
        <nav [class]="styleClass" [ngStyle]="style" [ngClass]="'p-breadcrumb p-component'" [attr.data-pc-name]="'breadcrumb'" [attr.data-pc-section]="'root'">
          <ol [attr.data-pc-section]="'menu'" class="p-breadcrumb-list">
            @if (home) {
              <li
                [class]="home.styleClass"
                [attr.id]="home.id"
                [ngClass]="{ 'p-breadcrumb-home': true, 'p-disabled': home.disabled }"
                [ngStyle]="home.style"
                pTooltip
                [tooltipOptions]="home.tooltipOptions"
                [attr.data-pc-section]="'home'"
                [attr.aria-disabled]="home.disabled"
                >
                @if (!home.routerLink) {
                  <a
                    [href]="home.url ? home.url : null"
                    [attr.aria-label]="homeAriaLabel"
                    class="p-menuitem-link"
                    (click)="onClick($event, home)"
                    [target]="home.target"
                    [attr.title]="home.title"
                    [attr.tabindex]="home.disabled ? '-1' : home.tabindex || '0'"
                    [attr.ariaCurrentWhenActive]="isCurrentUrl(home)"
                    >
                    @if (home.icon) {
                      <span class="p-menuitem-icon" [ngClass]="home.icon" [ngStyle]="home.iprivateyle"></span>
                    }
                    @if (!home.icon) {
                      <HomeIcon [styleClass]="'p-menuitem-icon'" />
                    }
                    @if (home.label) {
                      @if (home.escape !== false) {
                        <span class="p-menuitem-text">{{ home.label }}</span>
                      } @else {
                        <span class="p-menuitem-text" [innerHTML]="home.label"></span>
                      }
                    }
                  </a>
                }
                @if (home.routerLink) {
                  <a
                    [routerLink]="home.routerLink"
                    [attr.aria-label]="homeAriaLabel"
                    [queryParams]="home.queryParams"
                    [routerLinkActive]="'p-menuitem-link-active'"
                    [routerLinkActiveOptions]="home.routerLinkActiveOptions || { exact: false }"
                    class="p-menuitem-link"
                    (click)="onClick($event, home)"
                    [target]="home.target"
                    [attr.title]="home.title"
                    [attr.tabindex]="home.disabled ? '-1' : home.tabindex || '0'"
                    [attr.ariaCurrentWhenActive]="isCurrentUrl(home)"
                    [fragment]="home.fragment"
                    [queryParamsHandling]="home.queryParamsHandling"
                    [preserveFragment]="home.preserveFragment"
                    [skipLocationChange]="home.skipLocationChange"
                    [replaceUrl]="home.replaceUrl"
                    [state]="home.state"
                    >
                    @if (home.icon) {
                      <span class="p-menuitem-icon" [ngClass]="home.icon" [ngStyle]="home.iconStyle"></span>
                    }
                    @if (!home.icon) {
                      <HomeIcon [styleClass]="'p-menuitem-icon'" />
                    }
                    @if (home.label) {
                      @if (home.escape !== false) {
                        <span class="p-menuitem-text">{{ home.label }}</span>
                      } @else {
                        <span class="p-menuitem-text" [innerHTML]="home.label"></span>
                      }
                    }
                  </a>
                }
              </li>
            }
            @if (model && home) {
              <li class="p-menuitem-separator" [attr.data-pc-section]="'separator'">
                @if (!separatorTemplate) {
                  <ChevronRightIcon />
                }
                <ng-template *ngTemplateOutlet="separatorTemplate"></ng-template>
              </li>
            }
            @for (item of model; track item; let end = $last) {
              <li
                [class]="item.styleClass"
                [attr.id]="item.id"
                [attr.aria-disabled]="item.disabled"
                [ngStyle]="item.style"
                [ngClass]="{ 'p-disabled': item.disabled }"
                pTooltip
                [tooltipOptions]="item.tooltipOptions"
                [attr.data-pc-section]="'menuitem'"
                >
                @if (!item.routerLink) {
                  <a
                    [attr.href]="item.url ? item.url : null"
                    class="p-menuitem-link"
                    (click)="onClick($event, item)"
                    [target]="item.target"
                    [attr.title]="item.title"
                    [attr.tabindex]="item.disabled ? '-1' : item.tabindex || '0'"
                    [attr.ariaCurrentWhenActive]="isCurrentUrl(item)"
                    >
                    @if (!itemTemplate) {
                      @if (item.icon) {
                        <span class="p-menuitem-icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                      }
                      @if (item.label) {
                        @if (item.escape !== false) {
                          <span class="p-menuitem-text">{{ item.label }}</span>
                        } @else {
                          <span class="p-menuitem-text" [innerHTML]="item.label"></span>
                        }
                      }
                    }
                    @if (itemTemplate) {
                      <ng-template *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-template>
                    }
                  </a>
                }
                @if (item.routerLink) {
                  <a
                    [routerLink]="item.routerLink"
                    [queryParams]="item.queryParams"
                    [routerLinkActive]="'p-menuitem-link-active'"
                    [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                    class="p-menuitem-link"
                    (click)="onClick($event, item)"
                    [target]="item.target"
                    [attr.title]="item.title"
                    [attr.tabindex]="item.disabled ? '-1' : item.tabindex || '0'"
                    [fragment]="item.fragment"
                    [queryParamsHandling]="item.queryParamsHandling"
                    [preserveFragment]="item.preserveFragment"
                    [skipLocationChange]="item.skipLocationChange"
                    [replaceUrl]="item.replaceUrl"
                    [state]="item.state"
                    [attr.ariaCurrentWhenActive]="isCurrentUrl(item)"
                    >
                    @if (!itemTemplate) {
                      @if (item.icon) {
                        <span class="p-menuitem-icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                      }
                      @if (item.label) {
                        @if (item.escape !== false) {
                          <span class="p-menuitem-text">{{ item.label }}</span>
                        } @else {
                          <span class="p-menuitem-text" [innerHTML]="item.label"></span>
                        }
                      }
                    }
                    @if (itemTemplate) {
                      <ng-template *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-template>
                    }
                  </a>
                }
              </li>
              @if (!end) {
                <li class="p-menuitem-separator" [attr.data-pc-section]="'separator'">
                  @if (!separatorTemplate) {
                    <ChevronRightIcon />
                  }
                  <ng-template *ngTemplateOutlet="separatorTemplate"></ng-template>
                </li>
              }
            }
          </ol>
        </nav>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./breadcrumb.css'],
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class Breadcrumb implements AfterContentInit {
    private router = inject(Router);

    /**
     * An array of menuitems.
     * @group Props
     */
    @Input() model: MenuItem[] | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * MenuItem configuration for the home icon.
     * @group Props
     */
    @Input() home: MenuItem | undefined;
    /**
     * Defines a string that labels the home icon for accessibility.
     * @group Props
     */
    @Input() homeAriaLabel: string | undefined;
    /**
     * Fired when an item is selected.
     * @param {BreadcrumbItemClickEvent} event - custom click event.
     * @group Emits
     */
    @Output() onItemClick: EventEmitter<BreadcrumbItemClickEvent> = new EventEmitter<BreadcrumbItemClickEvent>();

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    separatorTemplate: TemplateRef<any> | undefined;

    itemTemplate: TemplateRef<any> | undefined;

    onClick(event: MouseEvent, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.onItemClick.emit({
            originalEvent: event,
            item: item
        });
    }

    onHomeClick(event: MouseEvent | any) {
        if (this.home) {
            this.onClick(event, this.home);
        }
    }

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'separator':
                    this.separatorTemplate = item.template;
                    break;

                case 'item':
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    isCurrentUrl(item) {
        const { routerLink } = item;
        const lastPath = this.router ? this.router.url : '';

        return routerLink === lastPath ? 'page' : undefined;
    }
}

@NgModule({
    imports: [CommonModule, RouterModule, TooltipModule, ChevronRightIcon, HomeIcon, SharedModule],
    exports: [Breadcrumb, RouterModule, TooltipModule, SharedModule],
    declarations: [Breadcrumb]
})
export class BreadcrumbModule {}
