import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./Modules/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./Modules/login/login.module').then(m => m.LoginModule)},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  //{ path: '', redirectTo: 'login', pathMatch:'full' },
  //{ path: '**', redirectTo: 'login', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
