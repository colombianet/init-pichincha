import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { BookCardComponent } from './book-card/book-card.component';



@NgModule({
  declarations: [
    NavbarComponent,
    BookCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    BookCardComponent
  ]
})
export class SharedModule { }
