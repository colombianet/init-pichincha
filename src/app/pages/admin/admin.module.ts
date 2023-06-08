import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { RegisterBookComponent } from './pages/register-book/register-book.component';
import { SharedModule } from "./pages/shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SlicePipe } from './pipes/slice.pipe';
import { SharedGeneralModule } from 'src/app/shared/shared-general.module';


@NgModule({
    declarations: [
        RegisterBookComponent,
        SlicePipe
    ],
    exports: [
        SlicePipe
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        SharedGeneralModule
    ]
})
export class AdminModule { }
