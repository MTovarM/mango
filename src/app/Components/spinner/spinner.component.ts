import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="overlay" *ngIf="isloading$ | async">
    <mat-spinner></mat-spinner>
  <div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  isloading$ = this.spinner.IsLoading$;

  constructor(private readonly spinner: SpinnerService ){}
}
