import { Component } from '@angular/core';
import { Code } from '@domain/code';

@Component({
    selector: 'import-demo',
    template: ` <app-code [code]="code" [hideToggleCode]="true" /> `,
    standalone: false
})
export class ImportDoc {
    code: Code = {
        typescript: `import { MessagesModule } from 'primeng/messages';`
    };
}
