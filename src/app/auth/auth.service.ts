import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthData } from './auth-data.model';
import { Subject } from "rxjs"
import { Router } from '@angular/router';

/*
injectable providedIn: root tells Angular where this service is and only creates one instance of it.
similarly, you couldve added this calss to the Providers array in app.module.ts and gotten the same effect.
*/
@Injectable({
    providedIn: "root"
})
export class AuthService{
    private token: string;
    private tokenTimer: NodeJS.Timer;
    private isAuthenticated:boolean = false;
    private authStatusListener = new Subject<boolean>();
    private nodeServerAddress: string = environment.nodeUrl;
    
    constructor(private httpClient: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    createUser(email: string, password: string){
        const authData: AuthData = {email: email, password: password};
        this.httpClient.post(this.nodeServerAddress+'/api/user/signup', authData)
            .subscribe(response =>{
                console.log(response);
            });
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password}
        this.httpClient.post<{token: string}>(this.nodeServerAddress+'/api/user/login', authData)
            .subscribe(response => {
                if(response.token){
                    this.token = response.token;
                    //timeout defaults to ms
                    this.tokenTimer = setTimeout(() => {
                        this.logout()
                    }, response.expiresIn*1000);
                    console.log(this.expiresInDuration );
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }
            });
    }

    logout(){
        this.token = null;
        clearTimeout(this.tokenTimer); 
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }
}