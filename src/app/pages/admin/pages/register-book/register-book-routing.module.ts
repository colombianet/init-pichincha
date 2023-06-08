import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterBookComponent } from './register-book.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterBookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterBookRoutingModule { }
