import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DataManagerService } from 'src/app/Services/data-manager.service';
import { FirebaseService } from 'src/app/Services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: any;
  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private dataManager: DataManagerService
  ) {}
  ngOnInit(): void {
    // this.firebasebasicService.currentUser.then(user => {
    //   if (user && user?.emailVerified) {
    //     this.user = user.email;
    //   }
    //   else {
    //     this.router.navigate(['/login']);
    //   }
    // });
    this.dataManager.getInventary();
    this.dataManager.getBrands();
    this.dataManager.getTypes();
  }

  logOut(): void {
    this.firebaseService.signOut();
  }
}
