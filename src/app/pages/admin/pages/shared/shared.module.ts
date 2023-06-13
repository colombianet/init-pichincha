import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { BookCardComponent } from './book-card/book-card.component';
import { RouterModule } from '@angular/router';
import { NoimageComponent } from './noimage/noimage.component';



@NgModule({
  declarations: [
    NavbarComponent,
    BookCardComponent,
    NoimageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    BookCardComponent,
    NoimageComponent
  ]
})
export class SharedModule { }
