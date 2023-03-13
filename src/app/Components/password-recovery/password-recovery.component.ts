import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { FirebaseService } from 'src/app/Services/firebase.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }

  onSubmit(): void {
    console.log(this.form.value.email);
    this.firebaseService.recoveryPassword(this.form.value.email)
    .then(response => {
      console.log("Then: ");
      console.log(response);
    })
    .catch(error => {
      console.log("Error: ");
      console.log(error);
    });
  }
}
