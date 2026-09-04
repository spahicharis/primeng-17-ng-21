import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, ViewEncapsulation, booleanAttribute } from '@angular/core';
import { CheckIcon } from 'primeng/icons/check';
import { ExclamationTriangleIcon } from 'primeng/icons/exclamationtriangle';
import { InfoCircleIcon } from 'primeng/icons/infocircle';
import { TimesCircleIcon } from 'primeng/icons/timescircle';
/**
 * Message groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-message',
    template: `
        <div aria-live="polite" class="p-inline-message p-component p-inline-message" [ngStyle]="style" [class]="styleClass" [ngClass]="containerClass">
          @if (icon === 'success') {
            <CheckIcon [styleClass]="'p-inline-message-icon'" />
          }
          @if (icon === 'info') {
            <InfoCircleIcon [styleClass]="'p-inline-message-icon'" />
          }
          @if (icon === 'error') {
            <TimesCircleIcon [styleClass]="'p-inline-message-icon'" />
          }
          @if (icon === 'warn') {
            <ExclamationTriangleIcon [styleClass]="'p-inline-message-icon'" />
          }
          @if (!escape) {
            <div>
              @if (!escape) {
                <span class="p-inline-message-text" [innerHTML]="text"></span>
              }
            </div>
          } @else {
            @if (escape) {
              <span class="p-inline-message-text">{{ text }}</span>
            }
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./message.css'],
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class UIMessage {
    /**
     * Severity level of the message.
     * @group Props
     */
    @Input() severity: 'success' | 'info' | 'warn' | 'error' | 'help' | 'primary' | 'secondary' | 'contrast' | string | null | undefined;
    /**
     * Text content.
     * @group Props
     */
    @Input() text: string | undefined;
    /**
     * Whether displaying messages would be escaped or not.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) escape: boolean = true;
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

    get icon() {
        if (this.severity) {
            return this.severity;
        } else {
            return 'info';
        }
    }

    get containerClass() {
        return {
            [`p-inline-message-${this.severity}`]: this.severity,
            'p-inline-message-icon-only': this.text == null
        };
    }
}

@NgModule({
    imports: [CommonModule, CheckIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon],
    exports: [UIMessage],
    declarations: [UIMessage]
})
export class MessageModule {}
