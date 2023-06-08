import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { SharedModule } from '../shared/shared.module';
import { AdminModule } from '../../admin.module';
import { SharedGeneralModule } from "../../../../shared/shared-general.module";


@NgModule({
    declarations: [
        BookComponent
    ],
    imports: [
        CommonModule,
        BookRoutingModule,
        SharedModule,
        AdminModule,
        SharedGeneralModule
    ]
})
export class BookModule { }
