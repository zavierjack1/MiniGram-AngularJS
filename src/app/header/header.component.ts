import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service'
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html', 
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
    public userIsAuthenticated = false;
    private authStatusSub: Subscription;
    constructor(private authService:AuthService){}
    userData: {userId: string, email: string, admin: boolean}; 
    ngOnInit(){
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated
                if (isAuthenticated){
                    this.userData = this.authService.getUserData();
                }
            })
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.userData = this.authService.getUserData();
    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}