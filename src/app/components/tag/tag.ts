import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, NgModule, QueryList, TemplateRef, ViewEncapsulation, booleanAttribute, inject } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
/**
 * Tag component is used to categorize content.
 * @group Components
 */
@Component({
    selector: 'p-tag',
    template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
          <ng-content></ng-content>
          @if (!iconTemplate) {
            @if (icon) {
              <span class="p-tag-icon" [ngClass]="icon"></span>
            }
          }
          @if (iconTemplate) {
            <span class="p-tag-icon">
              <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
            </span>
          }
          <span class="p-tag-value">{{ value }}</span>
        </span>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tag.css'],
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class Tag {
    private cd = inject(ChangeDetectorRef);

    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() get style(): { [klass: string]: any } | null | undefined {
        return this._style;
    }
    set style(value: { [klass: string]: any } | null | undefined) {
        this._style = value;
        this.cd.markForCheck();
    }
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Severity type of the tag.
     * @group Props
     */
    @Input() severity: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined;
    /**
     * Value to display inside the tag.
     * @group Props
     */
    @Input() value: string | undefined;
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     */
    @Input() icon: string | undefined;
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) rounded: boolean | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    iconTemplate: TemplateRef<any> | undefined;

    _style: { [klass: string]: any } | null | undefined;

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
            }
        });
    }

    containerClass() {
        return {
            'p-tag p-component': true,
            [`p-tag-${this.severity}`]: this.severity,
            'p-tag-rounded': this.rounded
        };
    }
}

@NgModule({
    imports: [CommonModule, SharedModule],
    exports: [Tag, SharedModule],
    declarations: [Tag]
})
export class TagModule {}
