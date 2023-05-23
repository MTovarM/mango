import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent},
      { path: 'transactions', loadChildren: () => import('../transactions/transactions.module').then(m => m.TransactionsModule) },
      { path: 'files', loadChildren: () => import('../files/files.module').then(m => m.FilesModule) },
      { path: 'inventary', loadChildren: () => import('../inventary/inventary.module').then(m => m.InventaryModule) },
      { path: 'configurations', loadChildren: () => import('../configurations/configurations.module').then(m => m.ConfigurationsModule) },
      { path: 'third-party', loadChildren: () => import('../third-party/third-party.module').then(m => m.ThirdPartyModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
