import {
  Component,
  Directive,
  Input,
  NgModule,
  TemplateRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "p-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "<ng-content />",
})
export class Header {}

@Component({
  selector: "p-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "<ng-content />",
})
export class Footer {}

@Directive({
  selector: "[pTemplate]",
  standalone: true,
  host: {},
})
export class PrimeTemplate {
  template = inject<TemplateRef<any>>(TemplateRef);

  @Input() type: string | undefined;

  @Input("pTemplate") name: string | undefined;

  getType(): string {
    return this.name!;
  }
}

@NgModule({
  imports: [Header, Footer, PrimeTemplate],
  exports: [Header, Footer, PrimeTemplate],
})
export class SharedModule {}
