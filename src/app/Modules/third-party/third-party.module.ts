import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartyRoutingModule } from './third-party-routing.module';
import { ThirdPartyComponent } from './third-party.component';


@NgModule({
  declarations: [
    ThirdPartyComponent
  ],
  imports: [
    CommonModule,
    ThirdPartyRoutingModule
  ]
})
export class ThirdPartyModule { }
