import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { FirebaseService, User } from 'src/app/Services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ){}

  
  ngOnInit(): void{
    this.form = this.formBuilder.group({
      username: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void{
    this.user = {
      email: this.form.value.username,
      password: this.form.value.password
    };

    this.firebaseService.signIn(this.user)
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
