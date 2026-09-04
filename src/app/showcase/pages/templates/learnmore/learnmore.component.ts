import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as templateData from './templatedata.json';
@Component({
    selector: 'templates',
    templateUrl: './learnmore.component.html',
    styleUrl: './learnmore.scss'
})
export class LearnMoreComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    id: string;

    selectedTemplate: any;

    templateName: string;

    ngOnInit() {
        // this.id = this.route.snapshot.paramMap.get('id');
        // const findSelectedTemplate = templateData.templates.find((item: any) => item.name === this.id);
        // this.selectedTemplate = findSelectedTemplate?.data;
        // this.templateName = findSelectedTemplate?.name;
        // if (!findSelectedTemplate) {
        //     this.router.navigateByUrl('/not-found');
        // }
    }
}
