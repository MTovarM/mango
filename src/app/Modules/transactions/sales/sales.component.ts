import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  processTypeForm: UntypedFormGroup = new FormBuilder().group({});
  dataForm: UntypedFormGroup = new FormBuilder().group({});
  customerForm: UntypedFormGroup = new FormBuilder().group({});

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.processTypeForm = this.formBuilder.group({
      processType: ['', Validators.required],
    });
    this.dataForm = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.customerForm = this.formBuilder.group(
      {}
    )
  }

  onClick(event: any): void {
    console.log(this.processTypeForm);
  }

}
