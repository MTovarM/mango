import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/Services/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private firebasebasicService: AngularFireAuth
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
  }

  logOut(): void {
    this.firebaseService.signOut();
  }
}
