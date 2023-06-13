import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicLibraryRoutingModule } from './public-library-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PublicLibraryComponent } from './public-library.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PublicLibraryComponent],
  imports: [
    CommonModule,
    PublicLibraryRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PublicLibraryModule { }
