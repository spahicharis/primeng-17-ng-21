import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { Nullable } from 'primeng/ts-helpers';
import { UniqueComponentId } from 'primeng/utils';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'p-stepperHeader',
    template: `
        @if (template) {
          <ng-container *ngTemplateOutlet="
                    template;
                    context: {
                        index: index,
                        active: active,
                        highlighted: highlighted,
                        class: 'p-stepper-action',
                        headerClass: 'p-stepper-action',
                        numberClass: 'p-stepper-number',
                        titleClass: 'p-stepper-title',
                        onClick: onClick
                    }
                "
         />
        } @else {
          <p-button [id]="id" class="p-stepper-action" role="tab" [tabindex]="disabled ? -1 : undefined" [aria-controls]="ariaControls" (click)="onClick.emit($event, index)">
            <span class="p-stepper-number">{{ index + 1 }}</span>
            <span class="p-stepper-title">{{ getStepProp }}</span>
          </p-button>
        }
        `,
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class StepperHeader {
    @Input() id: string | undefined;

    @Input() template: TemplateRef<any> | undefined;

    @Input() stepperPanel: StepperPanel;

    @Input() index: string | undefined;

    @Input() disabled: boolean | undefined;

    @Input() active: boolean | undefined;

    @Input() highlighted: boolean | undefined;

    @Input() getStepProp: string | undefined;

    @Input() ariaControls: string | undefined;

    @Output() onClick = new EventEmitter<void>();
}

@Component({
    selector: 'p-stepperSeparator',
    template: `
        @if (template) {
          <ng-container *ngTemplateOutlet="template; context: { index: index, active: active, highlighted: highlighted, class: separatorClass }" />
        } @else {
          <span [class]="separatorClass" aria-hidden="true"></span>
        }
        `,
    host: {
        class: 'p-stepper-separator'
    },
    standalone: false
})
export class StepperSeparator {
    @Input() template: TemplateRef<any> | undefined;

    @Input() separatorClass: string | undefined;

    @Input() stepperPanel: StepperPanel;

    @Input() index: string | undefined;

    @Input() active: boolean | undefined;

    @Input() highlighted: boolean | undefined;
}

@Component({
    selector: 'p-stepperContent',
    template: ` <div [id]="id" role="tabpanel" data-pc-name="stepperpanel" [attr.data-pc-index]="index" [attr.data-p-active]="active" [attr.aria-labelledby]="ariaLabelledby">
          @if (template) {
            <ng-container *ngTemplateOutlet="template; context: { index: index, active: active, highlighted: highlighted, onClick: onClick, prevCallback: prevCallback, nextCallback: nextCallback }"></ng-container>
          }
          @if (!template) {
            @if (stepperPanel) {
              <ng-container *ngTemplateOutlet="stepperPanel"></ng-container>
            }
          }
        </div>`,
    host: {
        '[class.p-stepper-content]': 'true',
        '[class.p-element]': 'true',
        '[class.p-toggleable-content]': "orientation === 'vertical'"
    },
    standalone: false
})
export class StepperContent {
    @Input() id: string | undefined;

    @Input() orientation: 'vertical' | 'horizontal';

    @Input() template: TemplateRef<any> | undefined;

    @Input() ariaLabelledby: string | undefined;

    @Input() stepperPanel: StepperPanel;

    @Input() index: string | undefined;

    @Input() active: boolean | undefined;

    @Input() highlighted: boolean | undefined;

    @Output() onClick = new EventEmitter<void>();

    @Output() prevCallback = new EventEmitter<void>();

    @Output() nextCallback = new EventEmitter<void>();
}

@Component({
    selector: 'p-stepperPanel',
    template: ` <ng-content /> `,
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class StepperPanel {
    @Input() header: string | undefined;

    @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

    headerTemplate: Nullable<TemplateRef<any>>;

    startTemplate: Nullable<TemplateRef<any>>;

    contentTemplate: Nullable<TemplateRef<any>>;

    separatorTemplate: Nullable<TemplateRef<any>>;

    endTemplate: Nullable<TemplateRef<any>>;

    ngAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'separator':
                    this.separatorTemplate = item.template;
                    break;
            }
        });
    }
}

/**
 * The Stepper component displays a wizard-like workflow by guiding users through the multi-step progression.
 * @group Components
 */
@Component({
    selector: 'p-stepper',
    template: `
        <div role="tablist">
          @if (startTemplate) {
            <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
          }
          @if (orientation === 'horizontal') {
            <ul class="p-stepper-nav">
              @for (step of panels; track trackByFn(index, step); let index = $index) {
                <li
                  [key]="getStepKey(step, index)"
                  class="p-stepper-header"
                            [ngClass]="{
                                'p-highlight': isStepActive(index),
                                'p-disabled': isItemDisabled(index)
                            }"
                  [attr.aria-current]="isStepActive(index) ? 'step' : undefined"
                  role="presentation"
                  [data-pc-name]="stepperPanel"
                  [data-p-highlight]="isStepActive(index)"
                  [data-p-disabled]="isItemDisabled(index)"
                  [data-pc-index]="index"
                  [data-p-active]="isStepActive(index)"
                  >
                  <p-stepperHeader
                    [id]="getStepHeaderActionId(index)"
                    [template]="step.headerTemplate"
                    [stepperPanel]="step"
                    [getStepProp]="getStepProp(step, 'header')"
                    [index]="index"
                    [disabled]="isItemDisabled(index)"
                    [active]="isStepActive(index)"
                    [highlighted]="index < activeStep"
                    [class]="'p-stepper-action'"
                    [aria-controls]="getStepContentId(index)"
                    (onClick)="onItemClick($event, index)"
                  ></p-stepperHeader>
                  @if (index !== stepperPanels.length - 1) {
                    <p-stepperSeparator [template]="step.separatorTemplate" [separatorClass]="'p-stepper-separator'" [stepperPanel]="step" [index]="index" [active]="isStepActive(index)" [highlighted]="index < activeStep" />
                  }
                </li>
              }
            </ul>
            <div class="p-stepper-panels">
              @for (step of panels; track trackByFn(index, step); let index = $index) {
                @if (isStepActive(index)) {
                  <p-stepperContent
                    [id]="getStepContentId(index)"
                    [template]="step.contentTemplate"
                    [orientation]="orientation"
                    [stepperPanel]="step"
                    [index]="index"
                    [active]="isStepActive(index)"
                    [highlighted]="index < activeStep"
                    [ariaLabelledby]="getStepHeaderActionId(index)"
                    (onClick)="onItemClick($event, index)"
                    (nextCallback)="nextCallback($event, index)"
                    (prevCallback)="prevCallback($event, index)"
                    />
                }
              }
            </div>
          } @else {
            @for (step of panels; track trackByFn(index, step); let index = $index) {
              <div
                [key]="getStepKey(step, index)"
                class="p-stepper-panel"
                        [ngClass]="{
                            'p-stepper-panel-active': orientation === 'vertical' && isStepActive(index)
                        }"
                [attr.aria-current]="isStepActive(index) ? 'step' : undefined"
                [data-pc-name]="'stepperpanel'"
                [data-p-highlight]="isStepActive(index)"
                [data-p-disabled]="isItemDisabled(index)"
                [data-pc-index]="index"
                [data-p-active]="isStepActive(index)"
                >
                <div
                  class="p-stepper-header "
                            [ngClass]="{
                                'p-highlight': isStepActive(index),
                                'p-disabled': isItemDisabled(index)
                            }"
                  >
                  <p-stepperHeader
                    [id]="getStepHeaderActionId(index)"
                    [template]="step.headerTemplate"
                    [stepperPanel]="step"
                    [getStepProp]="getStepProp(step, 'header')"
                    [index]="index"
                    [disabled]="isItemDisabled(index)"
                    [active]="isStepActive(index)"
                    [highlighted]="index < activeStep"
                    [class]="'p-stepper-action'"
                    [aria-controls]="getStepContentId(index)"
                    (onClick)="onItemClick($event, index)"
                  ></p-stepperHeader>
                </div>
                <div class="p-stepper-toggleable-content" [@tabContent]="isStepActive(index) ? { value: 'visible', params: { transitionParams: transitionOptions } } : { value: 'hidden', params: { transitionParams: transitionOptions } }">
                  @if (index !== stepperPanels.length - 1) {
                    <p-stepperSeparator [template]="step.separatorTemplate" [separatorClass]="'p-stepper-separator'" [stepperPanel]="step" [index]="index" [active]="isStepActive(index)" [highlighted]="index < activeStep" />
                  }
                  <p-stepperContent
                    [id]="getStepContentId(index)"
                    [template]="step.contentTemplate"
                    [orientation]="orientation"
                    [stepperPanel]="step"
                    [index]="index"
                    [active]="isStepActive(index)"
                    [highlighted]="index < activeStep"
                    [ariaLabelledby]="getStepHeaderActionId(index)"
                    (onClick)="onItemClick($event, index)"
                    (nextCallback)="nextCallback($event, index)"
                    (prevCallback)="prevCallback($event, index)"
                    />
                </div>
              </div>
            }
          }
          @if (endTemplate) {
            <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./stepper.css'],
    host: {
        '[class.p-stepper]': 'true',
        '[class.p-component]': 'true',
        '[class.p-stepper-vertical]': "orientation === 'vertical'"
    },
    animations: [
        trigger('tabContent', [
            state('hidden', style({
                height: '0',
                visibility: 'hidden'
            })),
            state('visible', style({
                height: '*',
                visibility: 'visible'
            })),
            transition('visible <=> hidden', [animate('250ms cubic-bezier(0.86, 0, 0.07, 1)')]),
            transition('void => *', animate(0))
        ])
    ],
    standalone: false
})
export class Stepper implements AfterContentInit {
    /**
     * Active step index of stepper.
     * @group Props
     */
    @Input() activeStep: number | undefined | null = 0;
    /**
     * Orientation of the stepper.
     * @group Props
     */
    @Input() orientation: 'vertical' | 'horizontal' = 'horizontal';
    /**
     * Whether the steps are clickable or not.
     * @group Props
     */
    @Input() linear: boolean = false;
    /**
     * Transition options of the animation.
     * @group Props
     */
    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';

    @ContentChildren(StepperPanel) stepperPanels: QueryList<StepperPanel> | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Emitted when the value changes.
     * @param {ActiveStepChangeEvent} event - custom change event.
     * @group Emits
     */
    @Output() activeStepChange: EventEmitter<number> = new EventEmitter<number>();

    headerTemplate: Nullable<TemplateRef<any>>;

    startTemplate: Nullable<TemplateRef<any>>;

    separatorTemplate: Nullable<TemplateRef<any>>;

    endTemplate: Nullable<TemplateRef<any>>;

    id: string = UniqueComponentId();

    panels!: StepperPanel[];

    isStepActive(index: number) {
        return this.activeStep === index;
    }

    getStepProp(step) {
        if (step?.header) {
            return step.header;
        }

        if (step?.content) {
            return step.content;
        }
        return undefined;
    }

    getStepKey(step, index) {
        return this.getStepProp(step) || index;
    }

    getStepHeaderActionId(index) {
        return `${this.id}_${index}_header_action`;
    }

    getStepContentId(index) {
        return `${this.id}_${index}_content`;
    }

    updateActiveStep(event, index) {
        this.activeStep = index;

        this.activeStepChange.emit(this.activeStep);
    }

    onItemClick(event, index) {
        if (this.linear) {
            event.preventDefault();

            return;
        }
        if (index !== this.activeStep) {
            this.updateActiveStep(event, index);
        }
    }

    isItemDisabled(index) {
        return this.linear && !this.isStepActive(index);
    }

    prevCallback(event, index) {
        if (index !== 0) {
            this.updateActiveStep(event, index - 1);
        }
    }

    nextCallback(event, index) {
        if (index !== this.stepperPanels.length - 1) {
            this.updateActiveStep(event, index + 1);
        }
    }

    trackByFn(index: number): number {
        return index;
    }

    ngAfterContentInit() {
        this.panels = (this.stepperPanels as QueryList<StepperPanel>).toArray();
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;

                case 'end':
                    this.endTemplate = item.template;
                    break;

                default:
                    break;
            }
        });
    }
}

@NgModule({
    imports: [CommonModule, SharedModule],
    exports: [Stepper, StepperPanel, StepperContent, StepperHeader, StepperSeparator, SharedModule],
    declarations: [Stepper, StepperPanel, StepperPanel, StepperContent, StepperHeader, StepperSeparator]
})
export class StepperModule {}
