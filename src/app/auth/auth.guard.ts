import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router} from '@angular/router';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core"
import { AuthService } from "./auth.service";

//if you want to add services to services you need injectable
@Injectable() 
export class AuthGuard implements CanActivate{
    constructor (private authService: AuthService, private router: Router){}
    //takes route and state, must return boolean or observable that returns a boolean or promise that returns a boolean
    canActivate(
            route: ActivatedRouteSnapshot, 
            state: RouterStateSnapshot
        ): boolean | Observable<boolean> | Promise<boolean> {

        const isAuthenticated = this.authService.getIsAuthenticated(); 
        if (!isAuthenticated){
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }

}