import { NgModule } from "@angular/core";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [
        LoginComponent, 
        SignupComponent
    ],
    imports: [
        CommonModule, //adds common functionality like ngIf
        AngularMaterialModule,
        RouterModule, 
        FormsModule, 
        AuthRoutingModule
    ]
}) 
export class AuthModule{ }
