import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewContainerRef, booleanAttribute, numberAttribute, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '@service/appconfigservice';

@Component({
    selector: 'app-docapitable',
    template: ` @if (data) {
   @if (parentId) {
     <div class="my-3 pt-3">
       <app-docsectiontext [parentId]="parentId" [parentTitle]="parentTitle" [parentDescription]="parentDescription" [level]="2"></app-docsectiontext>
     </div>
   }
   <app-docsectiontext [id]="id" [title]="label" [level]="3">
     <p>{{ description || null }}</p>
   </app-docsectiontext>
   @if (!data[0].data) {
     <div class="doc-tablewrapper mt-3">
       <table class="doc-table">
         <thead>
           <tr>
             @for (key of getKeys(data[0]); track key) {
               <th>
                 @if (key !== 'readonly' && key !== 'optional' && key !== 'deprecated') {
                   {{ key }}
                 }
               </th>
             }
           </tr>
         </thead>
         <tbody>
           @for (prop of data; track prop) {
             <tr>
               @for (entry of getEntries(prop); track entry) {
                 <td>
                   @if (entry[0] !== 'readonly' && entry[0] !== 'optional' && entry[0] !== 'deprecated') {
                     @if (entry[0] === 'name') {
                       <span [attr.id]="id + '.' + entry[1]" class="doc-option-name" [ngClass]="{ 'line-through cursor-pointer': !!prop.deprecated }" [attr.title]="prop.deprecated"
                         >{{ entry[1] || '-' }}<a (click)="navigate($event, entry[1])" class="doc-option-link"><i class="pi pi-link"></i></a
                       ></span>
                     }
                     @if (entry[0] === 'type') {
                       <span class="doc-option-type">{{ entry[1] || '-' }}</span>
                     }
                     @if (entry[0] === 'parameters') {
                       @for (parameter of entry[1]; track parameter) {
                         @if (parameter.name) {
                           <div class="doc-option-params">
                             @if (parameter.name) {
                               <span [ngClass]="{ 'doc-option-parameter-name': label === 'Emitters', 'text-primary-700': label === 'Templates' }">{{ parameter.name }} :</span>
                             }
                             @for (value of getType(parameter.type); track value; let i = $index) {
                               {{ i !== 0 ? ' |' : ' ' }}
                               @if (isLinkType(value)) {
                                 <a
                                   (click)="scrollToLinkedElement($event, value, prop)"
                                   [ngClass]="{ 'doc-option-parameter-type': label === 'Emitters', 'text-primary-700': label === 'Templates' }"
                                   >{{ value || '-' }}</a
                                   >
                                 } @else {
                                   <span [ngClass]="{ 'doc-option-parameter-type': label === 'Emitters', 'text-primary-700': label === 'Templates' }">{{ value }}</span>
                                 }
                               }
                             </div>
                           } @else {
                             <span>null</span>
                           }
                         }
                       }
                       @if (entry[0] !== 'name' && entry[0] !== 'type' && entry[0] !== 'parameters') {
                         <span
                                    [ngClass]="{
                                        'doc-option-dark': isDarkMode && entry[0] === 'default',
                                        'doc-option-light': !isDarkMode && entry[0] === 'default',
                                        'doc-option-default': entry[0] === 'default',
                                        'doc-option-description': entry[0] === 'description'
                                    }"
                           [id]="id + '.' + entry[0]"
                           >{{ entry[1] }}
                         </span>
                       }
                     }
                   </td>
                 }
               </tr>
             }
           </tbody>
         </table>
       </div>
     }
     @if (data[0].data && data[0].data.length > 0) {
       @for (childData of data; track childData) {
         <app-docapitable [id]="childData.id" [data]="childData.data" [label]="childData.label" [description]="childData.description" [relatedProp]="childData.relatedProp" />
       }
     }
   }`,
    styles: [
        `
            .parameter-bold {
                font-weight: bold;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppDocApiTable {
    viewContainerRef = inject(ViewContainerRef);
    router = inject(Router);
    location = inject(Location);
    private configService = inject(AppConfigService);

    @Input() id: string;

    @Input() label: string;

    @Input() data: any[];

    @Input() description: string;

    @Input() relatedProp: string;

    @Input() parentTitle: string;

    @Input() parentDescription: string;

    @Input() parentId: string;

    @Input({ transform: numberAttribute }) level: number;

    @Input({ transform: booleanAttribute }) isInterface: boolean = false;

    get isDarkMode(): boolean {
        return this.configService.config().darkMode;
    }

    navigate(event, param) {
        if (typeof window !== undefined) {
            const parentElement = event.currentTarget.parentElement;
            this.location.go(this.location.path() + '#' + this.id + '.' + param);

            setTimeout(() => {
                parentElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 1);
            event.preventDefault();
        }
    }

    getKeys(object) {
        return Object.keys(object);
    }

    getEntries(object) {
        return Object.entries(object);
    }

    ngAfterViewInit() {}

    getType(value) {
        if (this.label === 'Templates') {
            return value?.split('|');
        }
        if (this.label === 'Methods' && !value) {
            return ['-'];
        }

        return value?.split('|').map((item) => item.replace(/(\[|\]|<|>).*$/gm, '').trim());
    }

    isLinkType(value) {
        if (this.label === 'Templates') return false;
        const validValues = ['confirmationoptions', 'toastmessageoptions'];
        return value.toLowerCase().includes(this.id.split('.')[1].toLowerCase()) || validValues.includes(value.toLowerCase());
    }

    setLinkPath(value, type) {
        const currentRoute = this.router.url;
        let componentName = this.id.split('.')[1];

        const validValues = ['menuitem', 'confirmationoptions'];
        let definationType = type ? type : value.includes('Type') ? 'types' : value.includes('Event') ? 'events' : validValues.includes(value.toLowerCase()) ? 'options' : 'interfaces';

        if (componentName.includes('toast')) {
            componentName = 'toast';
        }

        return definationType === 'options' ? `/${currentRoute}/#api.${definationType}.${value}` : `/${currentRoute}/#api.${componentName}.${definationType}.${value}`;
    }

    scrollToLinkedElement(event, value) {
        if (document && document.createElement) {
            const section = this.label === 'Emitters' ? 'Events' : this.label;
            const elementId = `api.${this.id.split('.')[1].toLowerCase()}.${section.toLowerCase()}.${value}`;

            setTimeout(() => {
                this.scrollToLabelById(elementId);
            }, 1);

            event.preventDefault();
        }
    }

    scrollToLabelById(id) {
        if (typeof document !== undefined) {
            const label = document.getElementById(id);
            this.location.go(`${this.location.path()}/#${id}`);
            label && label.parentElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }
}
