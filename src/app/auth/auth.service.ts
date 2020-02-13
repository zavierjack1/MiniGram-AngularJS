import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthData } from './auth-data.model';

@Injectable({
    providedIn: "root"
})
export class AuthService{
    private nodeServerAddress: string = environment.nodeUrl;
    
    constructor(private httpClient: HttpClient){}

    createUser(email: string, password: string){
        const authData: AuthData = {email, password};
        this.httpClient.post(this.nodeServerAddress+'/api/user/signup', authData)
            .subscribe(response =>{
                console.log(response);
            });
    }
}