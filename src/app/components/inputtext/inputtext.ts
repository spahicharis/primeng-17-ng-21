import { NgModule, Directive, ElementRef, HostListener, DoCheck, ChangeDetectorRef, AfterViewInit, Input, inject } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Nullable } from 'primeng/ts-helpers';
import { PrimeNGConfig } from 'primeng/api';

/**
 * InputText directive is an extension to standard input element with theming.
 * @group Components
 */
@Directive({
    selector: '[pInputText]',
    host: {
        class: 'p-inputtext p-component p-element',
        '[class.p-filled]': 'filled',
        '[class.p-variant-filled]': 'variant === "filled" || config.inputStyle() === "filled"'
    },
    standalone: false
})
export class InputText implements DoCheck, AfterViewInit {
    el = inject(ElementRef);
    ngModel = inject(NgModel, { optional: true });
    private cd = inject(ChangeDetectorRef);
    config = inject(PrimeNGConfig);

    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    @Input() variant: 'filled' | 'outlined' = 'outlined';

    filled: Nullable<boolean>;

    ngAfterViewInit() {
        this.updateFilledState();
        this.cd.detectChanges();
    }

    ngDoCheck() {
        this.updateFilledState();
    }

    @HostListener('input', ['$event'])
    onInput() {
        this.updateFilledState();
    }

    updateFilledState() {
        this.filled = (this.el.nativeElement.value && this.el.nativeElement.value.length) || (this.ngModel && this.ngModel.model);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [InputText],
    declarations: [InputText]
})
export class InputTextModule {}
