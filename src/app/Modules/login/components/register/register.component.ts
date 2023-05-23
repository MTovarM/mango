import { 
  Component,
  OnInit
 } from '@angular/core';
import { 
  Validators, 
  FormBuilder, 
  FormGroup } from "@angular/forms";
import { FirebaseService, User } from 'src/app/Services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  userRegister!: User;
  isSamePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      firstPassword: ['', [Validators.required, Validators.minLength(8)]],
      secondPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngSubmit(): void {
    if ((<string>this.form.value.firstPassword).toLowerCase() !== 
    (<string>this.form.value.secondPassword).toLowerCase()) {
      this.isSamePassword = false;
      return; 
    }
    this.userRegister = {
      email: this.form.value.email,
      password: this.form.value.firstPassword
    };

    this.firebaseService.createUser(this.userRegister)
    .then(response => {
      console.log("Then: ");
      console.log(response);
    })
    .catch(error => {
      console.log("Error: ");
      console.log(error);
    });
  }

  onChange(event: any): void {
    if ((<string>this.form.value.firstPassword).toLowerCase() !== 
    (<string>this.form.value.secondPassword).toLowerCase()) {
      this.isSamePassword = false;
      return; 
    }
    this.isSamePassword = true;
  }
}