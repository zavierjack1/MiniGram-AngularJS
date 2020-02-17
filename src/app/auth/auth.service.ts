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
    private tokenTimer: any;
    private userId: string;
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

    getUserId(){
        return this.userId;
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
        this.httpClient.post<{token: string, expiresIn: number, userId: string}>(this.nodeServerAddress+'/api/user/login', authData)
            .subscribe(response => {
                if(response.token && response.expiresIn){
                    this.token = response.token;
                    this.userId = response.userId;
                    this.setAuthTime(response.expiresIn*1000);//in milliseconds
                    const expirationDate  = new Date(new Date().getTime()+response.expiresIn*1000);
                    this.saveAuthData(this.token, expirationDate, this.userId);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }
            });
    }

    logout(){
        this.token = null;
        clearTimeout(this.tokenTimer); 
        this.clearAuthData();
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }

    //put in app.component.ts
    autoAuthUser(){
        const authInformation = this.getAuthData();
        const now = new Date();
        if (authInformation){
            //get milliseconds from beginning of time of authInformation - now.
            //if authInformation > 0 that means we're still valid
            const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
            if(expiresIn > 0){
                this.token = authInformation.token;
                this.isAuthenticated = true;
                this.userId = authInformation.userId;
                this.setAuthTime(expiresIn); //in milliseconds
                this.authStatusListener.next(true);
            }
        }
    }

    private setAuthTime(duration: number){
        //timeout defaults to ms
        this.tokenTimer = setTimeout(() =>{
            this.logout();
        }, duration);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId");

        if (!token || !expirationDate){
            return;
        }

        return{
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }
}