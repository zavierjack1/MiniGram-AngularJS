import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy{
    isLoading = false;
    private authStatusSubscription: Subscription;

    constructor(public authService: AuthService){};

    ngOnInit(): void {
        this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
            (isAuthenticated) => {
                this.isLoading = isAuthenticated;
            }
        );
    }
    ngOnDestroy(): void {
        this.authStatusSubscription.unsubscribe();
    }

    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }
}
