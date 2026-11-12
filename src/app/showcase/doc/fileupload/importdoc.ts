import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Code } from "@domain/code";

@Component({
  selector: "file-upload-import-doc",
  template: ` <app-code [code]="code" [hideToggleCode]="true" /> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImportDoc {
  code: Code = {
    typescript: `import { FileUploadModule } from 'primeng/fileupload';`,
  };
}
