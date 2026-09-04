import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, NgModule, OnDestroy, Output, QueryList, TemplateRef, ViewEncapsulation, booleanAttribute, inject } from '@angular/core';
import { PrimeTemplate, SharedModule, TreeNode } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { ChevronUpIcon } from 'primeng/icons/chevronup';
import { Nullable } from 'primeng/ts-helpers';
import { Subject, Subscription } from 'rxjs';
import { OrganizationChartNodeCollapseEvent, OrganizationChartNodeExpandEvent, OrganizationChartNodeSelectEvent, OrganizationChartNodeUnSelectEvent } from './organizationchart.interface';
@Component({
    selector: '[pOrganizationChartNode]',
    template: `
        @if (node) {
          <tbody [attr.data-pc-section]="'body'">
            <tr [attr.data-pc-section]="'row'">
              <td [attr.colspan]="colspan" [attr.data-pc-section]="'cell'">
                <div
                  [class]="node.styleClass"
                  [ngClass]="{ 'p-organizationchart-node-content': true, 'p-organizationchart-selectable-node': chart.selectionMode && node.selectable !== false, 'p-highlight': isSelected() }"
                  (click)="onNodeClick($event, node)"
                  [attr.data-pc-section]="'node'"
                  >
                  @if (!chart.getTemplateForNode(node)) {
                    <div>{{ node.label }}</div>
                  }
                  @if (chart.getTemplateForNode(node)) {
                    <div>
                      <ng-container *ngTemplateOutlet="chart.getTemplateForNode(node); context: { $implicit: node }"></ng-container>
                    </div>
                  }
                  @if (collapsible) {
                    @if (!leaf) {
                      <a tabindex="0" class="p-node-toggler" (click)="toggleNode($event, node)" (keydown.enter)="toggleNode($event, node)" (keydown.space)="toggleNode($event, node)" [attr.data-pc-section]="'nodeToggler'">
                        @if (!chart.togglerIconTemplate) {
                          @if (node.expanded) {
                            <ChevronDownIcon [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                          }
                          @if (!node.expanded) {
                            <ChevronUpIcon [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                          }
                        }
                        @if (chart.togglerIconTemplate) {
                          <span class="p-node-toggler-icon" [attr.data-pc-section]="'nodeTogglerIcon'">
                            <ng-template *ngTemplateOutlet="chart.togglerIconTemplate; context: { $implicit: node.expanded }"></ng-template>
                          </span>
                        }
                      </a>
                    }
                  }
                </div>
              </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
              <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
              </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
              @if (node.children && node.children.length === 1) {
                <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                  <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
                </td>
              }
              @if (node.children && node.children.length > 1) {
                @for (child of node.children; track child; let first = $first; let last = $last) {
                  <td [attr.data-pc-section]="'lineLeft'" class="p-organizationchart-line-left" [ngClass]="{ 'p-organizationchart-line-top': !first }">&nbsp;</td>
                  <td [attr.data-pc-section]="'lineRight'" class="p-organizationchart-line-right" [ngClass]="{ 'p-organizationchart-line-top': !last }">&nbsp;</td>
                }
              }
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-nodes" [@childState]="'in'" [attr.data-pc-section]="'nodes'">
              @for (child of node.children; track child) {
                <td colspan="2" [attr.data-pc-section]="'nodeCell'">
                  <table class="p-organizationchart-table" pOrganizationChartNode [node]="child" [collapsible]="collapsible && node.children && node.children.length > 0"></table>
                </td>
              }
            </tr>
          </tbody>
        }
        `,
    animations: [trigger('childState', [state('in', style({ opacity: 1 })), transition('void => *', [style({ opacity: 0 }), animate(150)]), transition('* => void', [animate(150, style({ opacity: 0 }))])])],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./organizationchart.css'],
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class OrganizationChartNode implements OnDestroy {
    cd = inject(ChangeDetectorRef);

    @Input() node: TreeNode<any> | undefined;

    @Input({ transform: booleanAttribute }) root: boolean | undefined;

    @Input({ transform: booleanAttribute }) first: boolean | undefined;

    @Input({ transform: booleanAttribute }) last: boolean | undefined;

    @Input({ transform: booleanAttribute }) collapsible: boolean | undefined;

    chart: OrganizationChart;

    subscription: Subscription;

    constructor() {
        const chart = inject(OrganizationChart);

        this.chart = chart as OrganizationChart;
        this.subscription = this.chart.selectionSource$.subscribe(() => {
            this.cd.markForCheck();
        });
    }

    get leaf(): boolean | undefined {
        if (this.node) {
            return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
        }
    }

    get colspan() {
        if (this.node) {
            return this.node.children && this.node.children.length ? this.node.children.length * 2 : null;
        }
    }

    onNodeClick(event: Event, node: TreeNode) {
        this.chart.onNodeClick(event, node);
    }

    toggleNode(event: Event, node: TreeNode) {
        node.expanded = !node.expanded;
        if (node.expanded) this.chart.onNodeExpand.emit({ originalEvent: event, node: <TreeNode>this.node });
        else this.chart.onNodeCollapse.emit({ originalEvent: event, node: <TreeNode>this.node });

        event.preventDefault();
    }

    isSelected() {
        return this.chart.isSelected(this.node as TreeNode);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
/**
 * OrganizationChart visualizes hierarchical organization data.
 * @group Components
 */
@Component({
    selector: 'p-organizationChart',
    template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{ 'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace }" [attr.data-pc-section]="'root'">
          @if (root) {
            <table class="p-organizationchart-table" [collapsible]="collapsible" pOrganizationChartNode [node]="root"></table>
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        class: 'p-element'
    },
    standalone: false
})
export class OrganizationChart implements AfterContentInit {
    el = inject(ElementRef);
    cd = inject(ChangeDetectorRef);

    /**
     * An array of nested TreeNodes.
     * @group Props
     */
    @Input() value: TreeNode[] | undefined;
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
    /**
     * Defines the selection mode.
     * @group Props
     */
    @Input() selectionMode: 'single' | 'multiple' | null | undefined;
    /**
     * Whether the nodes can be expanded or toggled.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) collapsible: boolean | undefined;
    /**
     * Whether the space allocated by a node is preserved when hidden.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) preserveSpace: boolean = true;
    /**
     * A single treenode instance or an array to refer to the selections.
     * @group Props
     */
    @Input() get selection(): any {
        return this._selection;
    }
    set selection(val: any) {
        this._selection = val;

        if (this.initialized) this.selectionSource.next(null);
    }
    /**
     * Callback to invoke on selection change.
     * @param {*} any - selected value.
     * @group Emits
     */
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    /**
     * Callback to invoke when a node is selected.
     * @param {OrganizationChartNodeSelectEvent} event - custom node select event.
     * @group Emits
     */
    @Output() onNodeSelect: EventEmitter<OrganizationChartNodeSelectEvent> = new EventEmitter<OrganizationChartNodeSelectEvent>();
    /**
     * Callback to invoke when a node is unselected.
     * @param {OrganizationChartNodeUnSelectEvent} event - custom node unselect event.
     * @group Emits
     */
    @Output() onNodeUnselect: EventEmitter<OrganizationChartNodeUnSelectEvent> = new EventEmitter<OrganizationChartNodeUnSelectEvent>();
    /**
     * Callback to invoke when a node is expanded.
     * @param {OrganizationChartNodeExpandEvent} event - custom node expand event.
     * @group Emits
     */
    @Output() onNodeExpand: EventEmitter<OrganizationChartNodeExpandEvent> = new EventEmitter<OrganizationChartNodeExpandEvent>();
    /**
     * Callback to invoke when a node is collapsed.
     * @param {OrganizationChartNodeCollapseEvent} event - custom node collapse event.
     * @group Emits
     */
    @Output() onNodeCollapse: EventEmitter<OrganizationChartNodeCollapseEvent> = new EventEmitter<OrganizationChartNodeCollapseEvent>();

    @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

    public templateMap: any;

    togglerIconTemplate: Nullable<TemplateRef<any>>;

    private selectionSource = new Subject<any>();

    _selection: any;

    initialized: Nullable<boolean>;

    selectionSource$ = this.selectionSource.asObservable();

    get root(): TreeNode<any> | null {
        return this.value && this.value.length ? this.value[0] : null;
    }

    ngAfterContentInit() {
        if ((this.templates as QueryList<PrimeTemplate>).length) {
            this.templateMap = {};
        }

        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            if (item.getType() === 'togglericon') {
                this.togglerIconTemplate = item.template;
            } else {
                this.templateMap[item.getType()] = item.template;
            }
        });

        this.initialized = true;
    }

    getTemplateForNode(node: TreeNode): TemplateRef<any> | null {
        if (this.templateMap) return node.type ? this.templateMap[node.type] : this.templateMap['default'];
        else return null;
    }

    onNodeClick(event: Event, node: TreeNode) {
        let eventTarget = <Element>event.target;

        if (eventTarget.className && (DomHandler.hasClass(eventTarget, 'p-node-toggler') || DomHandler.hasClass(eventTarget, 'p-node-toggler-icon'))) {
            return;
        } else if (this.selectionMode) {
            if (node.selectable === false) {
                return;
            }

            let index = this.findIndexInSelection(node);
            let selected = index >= 0;

            if (this.selectionMode === 'single') {
                if (selected) {
                    this.selection = null;
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    this.selection = node;
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            } else if (this.selectionMode === 'multiple') {
                if (selected) {
                    this.selection = this.selection.filter((val: any, i: number) => i != index);
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    this.selection = [...(this.selection || []), node];
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }

            this.selectionChange.emit(this.selection);
            this.selectionSource.next(null);
        }
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;

        if (this.selectionMode && this.selection) {
            if (this.selectionMode === 'single') {
                index = this.selection == node ? 0 : -1;
            } else if (this.selectionMode === 'multiple') {
                for (let i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }
}

@NgModule({
    imports: [CommonModule, ChevronDownIcon, ChevronUpIcon, SharedModule],
    exports: [OrganizationChart, SharedModule],
    declarations: [OrganizationChart, OrganizationChartNode]
})
export class OrganizationChartModule {}
