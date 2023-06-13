import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenGuard } from './infrastructure/guards/token.guard';

const routes: Routes = [
  {
    path:"",
    children:[
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminModule),
        canLoad: [TokenGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
