import { AnimationEvent, animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, NgModule, NgZone, OnDestroy, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewChild, ViewEncapsulation, booleanAttribute, numberAttribute, inject } from '@angular/core';
import { Message, MessageService, PrimeNGConfig, PrimeTemplate, SharedModule } from 'primeng/api';
import { CheckIcon } from 'primeng/icons/check';
import { ExclamationTriangleIcon } from 'primeng/icons/exclamationtriangle';
import { InfoCircleIcon } from 'primeng/icons/infocircle';
import { TimesIcon } from 'primeng/icons/times';
import { TimesCircleIcon } from 'primeng/icons/timescircle';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { Subscription } from 'rxjs';
import { ToastCloseEvent, ToastItemCloseEvent, ToastPositionType } from './toast.interface';
import { DomHandler } from 'primeng/dom';

@Component({
    selector: 'p-toastItem',
    template: `
        <div
          #container
          [attr.id]="message?.id"
          [class]="message?.styleClass"
          [ngClass]="['p-toast-message-' + message?.severity, 'p-toast-message']"
          [@messageState]="{ value: 'visible', params: { showTransformParams: showTransformOptions, hideTransformParams: hideTransformOptions, showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
          (mouseenter)="onMouseEnter()"
          (mouseleave)="onMouseLeave()"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          [attr.data-pc-name]="'toast'"
          [attr.data-pc-section]="'root'"
          >
          @if (headlessTemplate) {
            <ng-container *ngTemplateOutlet="headlessTemplate; context: { $implicit: message, closeFn: onCloseIconClick }"></ng-container>
          } @else {
            <div class="p-toast-message-content" [ngClass]="message?.contentStyleClass" [attr.data-pc-section]="'content'">
              @if (!template) {
                @if (message.icon) {
                  <span [class]="'p-toast-message-icon pi ' + message.icon"></span>
                }
                @if (!message.icon) {
                  <span class="p-toast-message-icon" [attr.aria-hidden]="true" [attr.data-pc-section]="'icon'">
                    <ng-container>
                      @if (message.severity === 'success') {
                        <CheckIcon [attr.aria-hidden]="true" [attr.data-pc-section]="'icon'" />
                      }
                      @if (message.severity === 'info') {
                        <InfoCircleIcon [attr.aria-hidden]="true" [attr.data-pc-section]="'icon'" />
                      }
                      @if (message.severity === 'error') {
                        <TimesCircleIcon [attr.aria-hidden]="true" [attr.data-pc-section]="'icon'" />
                      }
                      @if (message.severity === 'warn') {
                        <ExclamationTriangleIcon [attr.aria-hidden]="true" [attr.data-pc-section]="'icon'" />
                      }
                    </ng-container>
                  </span>
                }
                <div class="p-toast-message-text" [attr.data-pc-section]="'text'">
                  <div class="p-toast-summary" [attr.data-pc-section]="'summary'">{{ message.summary }}</div>
                  <div class="p-toast-detail" [attr.data-pc-section]="'detail'">{{ message.detail }}</div>
                </div>
              }
              <ng-container *ngTemplateOutlet="template; context: { $implicit: message }"></ng-container>
              @if (message?.closable !== false) {
                <button
                  type="button"
                  class="p-toast-icon-close p-link"
                  (click)="onCloseIconClick($event)"
                  (keydown.enter)="onCloseIconClick($event)"
                  pRipple
                  [attr.aria-label]="closeAriaLabel"
                  [attr.data-pc-section]="'closebutton'"
                  >
                  @if (message.closeIcon) {
                    <span [class]="'pt-1 text-base p-toast-message-icon pi ' + message.closeIcon"></span>
                  }
                  @if (!message.closeIcon) {
                    <TimesIcon [styleClass]="'p-toast-icon-close-icon'" [attr.aria-hidden]="true" [attr.data-pc-section]="'closeicon'" />
                  }
                </button>
              }
            </div>
          }
        </div>
        `,
    animations: [
        trigger('messageState', [
            state('visible', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('void => *', [
                style({
                    transform: '{{showTransformParams}}',
                    opacity: 0
                }),
                animate('{{showTransitionParams}}')
            ]),
            transition('* => void', [
                animate('{{hideTransitionParams}}', style({
                    height: 0,
                    opacity: 0,
                    transform: '{{hideTransformParams}}'
                }))
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class ToastItem implements AfterViewInit, OnDestroy {
    private zone = inject(NgZone);
    private config = inject(PrimeNGConfig);

    @Input() message: Message | null | undefined;

    @Input({ transform: numberAttribute }) index: number | null | undefined;

    @Input({ transform: numberAttribute }) life: number;

    @Input() template: TemplateRef<any> | undefined;

    @Input() headlessTemplate: TemplateRef<any> | undefined;

    @Input() showTransformOptions: string | undefined;

    @Input() hideTransformOptions: string | undefined;

    @Input() showTransitionOptions: string | undefined;

    @Input() hideTransitionOptions: string | undefined;

    @Output() onClose: EventEmitter<ToastItemCloseEvent> = new EventEmitter();

    @ViewChild('container') containerViewChild: ElementRef | undefined;

    timeout: any;

    ngAfterViewInit() {
        this.initTimeout();
    }

    initTimeout() {
        if (!this.message?.sticky) {
            this.zone.runOutsideAngular(() => {
                this.timeout = setTimeout(
                    () => {
                        this.onClose.emit({
                            index: <number>this.index,
                            message: <Message>this.message
                        });
                    },
                    this.message?.life || this.life || 3000
                );
            });
        }
    }

    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    onMouseEnter() {
        this.clearTimeout();
    }

    onMouseLeave() {
        this.initTimeout();
    }

    onCloseIconClick = (event: Event) => {
        this.clearTimeout();

        this.onClose.emit({
            index: <number>this.index,
            message: <Message>this.message
        });

        event.preventDefault();
    };

    get closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    ngOnDestroy() {
        this.clearTimeout();
    }
}

/**
 * Toast is used to display messages in an overlay.
 * @group Components
 */
@Component({
    selector: 'p-toast',
    template: `
        <div #container class="p-toast p-component" [ngClass]="'p-toast-' + _position" [ngStyle]="style" [class]="styleClass">
          @for (msg of messages; track msg; let i = $index) {
            <p-toastItem
              [message]="msg"
              [index]="i"
              [life]="life"
              (onClose)="onMessageClose($event)"
              [template]="template"
              [headlessTemplate]="headlessTemplate"
              @toastAnimation
              (@toastAnimation.start)="onAnimationStart($event)"
              (@toastAnimation.done)="onAnimationEnd($event)"
              [showTransformOptions]="showTransformOptions"
              [hideTransformOptions]="hideTransformOptions"
              [showTransitionOptions]="showTransitionOptions"
              [hideTransitionOptions]="hideTransitionOptions"
            ></p-toastItem>
          }
        </div>
        `,
    animations: [trigger('toastAnimation', [transition(':enter, :leave', [query('@*', animateChild())])])],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./toast.css'],
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class Toast implements OnInit, AfterContentInit, OnDestroy {
    private document = inject<Document>(DOCUMENT);
    private renderer = inject(Renderer2);
    messageService = inject(MessageService);
    private cd = inject(ChangeDetectorRef);
    config = inject(PrimeNGConfig);

    /**
     * Key of the message in case message is targeted to a specific toast component.
     * @group Props
     */
    @Input() key: string | undefined;
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autoZIndex: boolean = true;
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    @Input({ transform: numberAttribute }) baseZIndex: number = 0;
    /**
     * The default time to display messages for in milliseconds.
     * @group Props
     */
    @Input({ transform: numberAttribute }) life: number = 3000;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Inline class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;

    /**
     * Position of the toast in viewport.
     * @group Props
     */
    @Input() get position(): ToastPositionType {
        return this._position;
    }

    set position(value: ToastPositionType) {
        this._position = value;
        this.cd.markForCheck();
    }

    /**
     * It does not add the new message if there is already a toast displayed with the same content
     * @group Props
     */
    @Input({ transform: booleanAttribute }) preventOpenDuplicates: boolean = false;
    /**
     * Displays only once a message with the same content.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) preventDuplicates: boolean = false;
    /**
     * Transform options of the show animation.
     * @group Props
     */
    @Input() showTransformOptions: string = 'translateY(100%)';
    /**
     * Transform options of the hide animation.
     * @group Props
     */
    @Input() hideTransformOptions: string = 'translateY(-100%)';
    /**
     * Transition options of the show animation.
     * @group Props
     */
    @Input() showTransitionOptions: string = '300ms ease-out';
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    @Input() hideTransitionOptions: string = '250ms ease-in';
    /**
     * Object literal to define styles per screen size.
     * @group Props
     */
    @Input() breakpoints: { [key: string]: any } | undefined;
    /**
     * Callback to invoke when a message is closed.
     * @param {ToastCloseEvent} event - custom close event.
     * @group Emits
     */
    @Output() onClose: EventEmitter<ToastCloseEvent> = new EventEmitter<ToastCloseEvent>();

    @ViewChild('container') containerViewChild: ElementRef | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    messageSubscription: Subscription | undefined;

    clearSubscription: Subscription | undefined;

    messages: Message[] | null | undefined;

    messagesArchieve: Message[] | undefined;

    template: TemplateRef<any> | undefined;

    headlessTemplate: TemplateRef<any> | undefined;

    _position: ToastPositionType = 'top-right';

    styleElement: any;

    id: string = UniqueComponentId();

    ngOnInit() {
        this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
            if (messages) {
                if (Array.isArray(messages)) {
                    const filteredMessages = messages.filter((m) => this.canAdd(m));
                    this.add(filteredMessages);
                } else if (this.canAdd(messages)) {
                    this.add([messages]);
                }
            }
        });

        this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
            if (key) {
                if (this.key === key) {
                    this.messages = null;
                }
            } else {
                this.messages = null;
            }

            this.cd.markForCheck();
        });
    }

    ngAfterViewInit() {
        if (this.breakpoints) {
            this.createStyle();
        }
    }

    add(messages: Message[]): void {
        this.messages = this.messages ? [...this.messages, ...messages] : [...messages];

        if (this.preventDuplicates) {
            this.messagesArchieve = this.messagesArchieve ? [...this.messagesArchieve, ...messages] : [...messages];
        }

        this.cd.markForCheck();
    }

    canAdd(message: Message): boolean {
        let allow = this.key === message.key;

        if (allow && this.preventOpenDuplicates) {
            allow = !this.containsMessage(this.messages!, message);
        }

        if (allow && this.preventDuplicates) {
            allow = !this.containsMessage(this.messagesArchieve!, message);
        }

        return allow;
    }

    containsMessage(collection: Message[], message: Message): boolean {
        if (!collection) {
            return false;
        }

        return (
            collection.find((m) => {
                return m.summary === message.summary && m.detail == message.detail && m.severity === message.severity;
            }) != null
        );
    }

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'message':
                    this.template = item.template;
                    break;
                case 'headless':
                    this.headlessTemplate = item.template;
                    break;

                default:
                    this.template = item.template;
                    break;
            }
        });
    }

    onMessageClose(event: ToastItemCloseEvent) {
        this.messages?.splice(event.index, 1);

        this.onClose.emit({
            message: event.message
        });

        this.cd.detectChanges();
    }

    onAnimationStart(event: AnimationEvent) {
        if (event.fromState === 'void') {
            this.renderer.setAttribute(this.containerViewChild?.nativeElement, this.id, '');
            if (this.autoZIndex && this.containerViewChild?.nativeElement.style.zIndex === '') {
                ZIndexUtils.set('modal', this.containerViewChild?.nativeElement, this.baseZIndex || this.config.zIndex.modal);
            }
        }
    }

    onAnimationEnd(event: AnimationEvent) {
        if (event.toState === 'void') {
            if (this.autoZIndex && ObjectUtils.isEmpty(this.messages)) {
                ZIndexUtils.clear(this.containerViewChild?.nativeElement);
            }
        }
    }

    createStyle() {
        if (!this.styleElement) {
            this.styleElement = this.renderer.createElement('style');
            this.styleElement.type = 'text/css';
            DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            this.renderer.appendChild(this.document.head, this.styleElement);
            let innerHTML = '';
            for (let breakpoint in this.breakpoints) {
                let breakpointStyle = '';
                for (let styleProp in this.breakpoints[breakpoint]) {
                    breakpointStyle += styleProp + ':' + this.breakpoints[breakpoint][styleProp] + ' !important;';
                }
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-toast[${this.id}] {
                           ${breakpointStyle}
                        }
                    }
                `;
            }

            this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
        }
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        if (this.containerViewChild && this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }

        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }

        this.destroyStyle();
    }
}

@NgModule({
    imports: [CommonModule, RippleModule, CheckIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon, TimesIcon],
    exports: [Toast, SharedModule],
    declarations: [Toast, ToastItem]
})
export class ToastModule {}
