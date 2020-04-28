import { NgModule } from "@angular/core";
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { BasicScrollComponent } from './scroll-test/basic-scroll.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        PostCreateComponent, 
        PostListComponent, 
        BasicScrollComponent
    ],
    imports: [
        CommonModule, //adds common functionality like ngIf
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostModule{ }
