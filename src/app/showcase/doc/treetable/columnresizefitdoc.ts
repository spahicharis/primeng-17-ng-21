import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Code } from '@domain/code';
import { NodeService } from '@service/nodeservice';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'resize-fit-doc',
    template: `
        <app-docsectiontext>
          <p>Columns can be resized with drag and drop when <i>resizableColumns</i> is enabled. Default resize mode is <i>fit</i> that does not change the overall table width.</p>
        </app-docsectiontext>
        <div class="card">
          <p-deferred-demo (load)="loadDemoData()">
            <p-treeTable [value]="files" [columns]="cols" [resizableColumns]="true" [tableStyle]="{ 'min-width': '50rem' }">
              <ng-template pTemplate="header" let-columns>
                <tr>
                  @for (col of columns; track col) {
                    <th ttResizableColumn>
                      {{ col.header }}
                    </th>
                  }
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                <tr [ttRow]="rowNode">
                  @for (col of columns; track col; let i = $index) {
                    <td>
                      @if (i === 0) {
                        <p-treeTableToggler [rowNode]="rowNode" />
                      }
                      {{ rowData[col.field] }}
                    </td>
                  }
                </tr>
              </ng-template>
            </p-treeTable>
          </p-deferred-demo>
        </div>
        <app-code [code]="code" selector="tree-table-resize-fit-demo" />
        `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResizeFitDoc {
    private nodeService = inject(NodeService);

    files!: TreeNode[];

    cols!: Column[];

    loadDemoData() {
        this.nodeService.getFilesystem().then((files) => (this.files = files));
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    }

    code: Code = {
        basic: `<p-treeTable 
    [value]="files" 
    [columns]="cols" 
    [resizableColumns]="true" 
    [tableStyle]="{'min-width': '50rem'}">
        <ng-template pTemplate="header" let-columns>
            <tr>
                <th *ngFor="let col of columns" ttResizableColumn>
                    {{ col.header }}
                </th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
            <tr [ttRow]="rowNode">
                <td *ngFor="let col of columns; let i = index">
                    <p-treeTableToggler [rowNode]="rowNode" *ngIf="i === 0" />
                    {{ rowData[col.field] }}
                </td>
            </tr>
        </ng-template>
</p-treeTable>`,

        html: `<div class="card">
    <p-treeTable 
        [value]="files" 
        [columns]="cols" 
        [resizableColumns]="true" 
        [tableStyle]="{'min-width': '50rem'}">
            <ng-template pTemplate="header" let-columns>
                <tr>
                    <th *ngFor="let col of columns" ttResizableColumn>
                        {{ col.header }}
                    </th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                <tr [ttRow]="rowNode">
                    <td *ngFor="let col of columns; let i = index">
                        <p-treeTableToggler [rowNode]="rowNode" *ngIf="i === 0" />
                        {{ rowData[col.field] }}
                    </td>
                </tr>
            </ng-template>
    </p-treeTable>
</div>`,

        typescript: `import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { NodeService } from '@service/nodeservice';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'tree-table-resize-fit-demo',
    templateUrl: './tree-table-resize-fit-demo.html',
    standalone: true,
    imports: [TreeTableModule, CommonModule],
    providers: [NodeService]
})
export class TreeTableResizeFitDemo implements OnInit {
    files!: TreeNode[];

    cols!: Column[];

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFilesystem().then((files) => (this.files = files));
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    }
}`,

        service: ['NodeService']
    };
}
