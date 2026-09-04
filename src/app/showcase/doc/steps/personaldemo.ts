import { Component, OnInit, inject } from '@angular/core';
import { TicketService } from '@service/ticketservice';
import { Router } from '@angular/router';

@Component({
    template: `
        <div class="stepsdemo-content">
          <p-card>
            <ng-template pTemplate="title"> Personal Information </ng-template>
            <ng-template pTemplate="subtitle"> Enter your personal information </ng-template>
            <ng-template pTemplate="content">
              <div class="p-fluid">
                <div class="field">
                  <label for="firstname">Firstname</label>
                  <input
                    #firstname="ngModel"
                    id="firstname"
                    type="text"
                    required
                    pInputText
                    [(ngModel)]="personalInformation.firstname"
                    [ngClass]="{ 'ng-dirty': (firstname.invalid && submitted) || (firstname.dirty && firstname.invalid) }"
                    />
                  @if ((firstname.invalid && submitted) || (firstname.dirty && firstname.invalid)) {
                    <small class="p-error">Firstname is required.</small>
                  }
                </div>
                <div class="field">
                  <label for="lastname">Lastname</label>
                  <input #lastname="ngModel" id="lastname" type="text" required pInputText [(ngModel)]="personalInformation.lastname" [ngClass]="{ 'ng-dirty': (lastname.invalid && submitted) || (lastname.dirty && lastname.invalid) }" />
                  @if ((lastname.invalid && submitted) || (lastname.dirty && lastname.invalid)) {
                    <small class="p-error">Lastname is required.</small>
                  }
                </div>
                <div class="field">
                  <label for="age">Age</label>
                  <input #age="ngModel" id="age" type="number" required pInputText [(ngModel)]="personalInformation.age" [ngClass]="{ 'ng-dirty': (age.invalid && submitted) || (age.dirty && age.invalid) }" />
                  @if ((age.invalid && submitted) || (age.dirty && age.invalid)) {
                    <small class="p-error">Age is required.</small>
                  }
                </div>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <div class="grid grid-nogutter justify-content-end">
                <p-button label="Next" (onClick)="nextPage()" icon="pi pi-angle-right" iconPos="right"></p-button>
              </div>
            </ng-template>
          </p-card>
        </div>
        `,
    standalone: false
})
export class PersonalDemo implements OnInit {
    ticketService = inject(TicketService);
    private router = inject(Router);

    personalInformation: any;

    submitted: boolean = false;

    ngOnInit() {
        this.personalInformation = this.ticketService.getTicketInformation().personalInformation;
    }

    nextPage() {
        if (this.personalInformation.firstname && this.personalInformation.lastname && this.personalInformation.age) {
            this.ticketService.ticketInformation.personalInformation = this.personalInformation;
            this.router.navigate(['steps/seat'], { fragment: 'routing' });

            return;
        }

        this.submitted = true;
    }
}
