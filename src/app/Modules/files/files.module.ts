import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';

import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';


@NgModule({
  declarations: [
    FilesComponent
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    MatToolbarModule
  ]
})
export class FilesModule { }
