import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventaryRoutingModule } from './inventary-routing.module';
import { InventaryComponent } from './inventary.component';


@NgModule({
  declarations: [
    InventaryComponent
  ],
  imports: [
    CommonModule,
    InventaryRoutingModule
  ]
})
export class InventaryModule { }
