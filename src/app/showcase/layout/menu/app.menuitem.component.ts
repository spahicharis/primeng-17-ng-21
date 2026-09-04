import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from './app.menu.component';
import { TagModule } from 'primeng/tag';

@Component({
    selector: '[app-menuitem]',
    template: `
        @if (root && item.children) {
          <button pButton type="button" class="px-link" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="slidedown" leaveToClass="hidden" leaveActiveClass="slideup">
            <div class="menu-icon">
              <i [ngClass]="item.icon"></i>
            </div>
            <span>{{ item.name }}</span>
            <i class="menu-toggle-icon pi pi-angle-down"></i>
          </button>
        }
        @if (item.href) {
          <a [href]="item.href" target="_blank" rel="noopener noreferrer">
            @if (item.icon && root) {
              <div class="menu-icon">
                <i [ngClass]="item.icon"></i>
              </div>
            }
            <span>{{ item.name }}</span>
            @if (item.badge) {
              <p-tag [value]="item.badge" />
            }
          </a>
        }
        @if (item.routerLink) {
          <a [routerLink]="item.routerLink" routerLinkActive="router-link-active" [routerLinkActiveOptions]="{ paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }">
            @if (item.icon && root) {
              <div class="menu-icon">
                <i [ngClass]="item.icon"></i>
              </div>
            }
            <span>{{ item.name }}</span>
            @if (item.badge) {
              <p-tag [value]="item.badge" />
            }
          </a>
        }
        @if (!root && item.children) {
          <span class="menu-child-category">{{ item.name }}</span>
        }
        @if (item.children) {
          <div class="overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out" [ngClass]="{ hidden: item.children && root && isActiveRootMenuItem(item) }">
            <ol>
              @for (child of item.children; track child) {
                <li app-menuitem [root]="false" [item]="child"></li>
              }
            </ol>
          </div>
        }
        `,
    imports: [CommonModule, StyleClassModule, RouterModule, TagModule]
})
export class AppMenuItemComponent {
    private router = inject(Router);

    @Input() item: MenuItem;

    @Input({ transform: booleanAttribute }) root: boolean = true;

    isActiveRootMenuItem(menuitem: MenuItem): boolean {
        const url = this.router.url.split('#')[0];
        return menuitem.children && !menuitem.children.some((item) => url.includes(item.routerLink) || (item.children && item.children.some((it) => url.includes(it.routerLink))));
    }
}
