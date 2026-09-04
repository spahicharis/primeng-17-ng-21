import { Component } from '@angular/core';
import { Code } from '@domain/code';

@Component({
    selector: 'import-doc',
    template: ` <app-code [code]="code" [hideToggleCode]="true" /> `,
    standalone: false
})
export class ImportDoc {
    code: Code = {
        typescript: `import { PickListModule } from 'primeng/picklist';`
    };
}
