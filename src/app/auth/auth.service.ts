import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthData } from './auth-data.model';

@Injectable({
    providedIn: "root"
})
export class AuthService{
    private token: string;
    private nodeServerAddress: string = environment.nodeUrl;
    
    constructor(private httpClient: HttpClient){}

    getToken(){
        return this.token;
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
                this.token = response.token;
            })
    }
}