import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [

      {
        path: 'public-library',
        loadChildren: () => import('./pages/public-library/public-library.module').then(m=>m.PublicLibraryModule),
        // canActivate: [UnauthGuard]
      },{
        path: 'books',
        loadChildren: () => import('./pages/books/books.module').then(m=>m.BooksModule),
        // canActivate: [UnauthGuard]
      },
      {
        path: 'register-book/:mode',
        loadChildren: () => import('./pages/register-book/register-book.module').then(m=>m.RegisterBookModule),
        // canActivate: [UnauthGuard]
      },
      {
        path: 'books/view/:id',
        loadChildren: () => import('./pages/book/book.module').then(m=>m.BookModule),
        // canActivate: [UnauthGuard]
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'public-library'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
