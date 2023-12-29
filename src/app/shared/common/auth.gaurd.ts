import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenLocalStorageService } from '../tokenLocalStorage/tokenLocalStorageService';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage:TokenLocalStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        /*
        const user =this.storage.get('Role');
        if (user) {
        ///important
            if (route.data.roles && ((route.data.roles).filter(x=>x ==user).length!==0)) {
                return true;
            }
        ///important
        // if (1==1) {
                
        //     return true;
        // }
            this.router.navigate(['/']);
            return false;
        }
        //localStorage.setItem('prevPath',state.url)
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
        */



        //const user =this.storage.get('Role');
        const userRoles = JSON.parse(this.storage.get('allRoles')); 

        if (userRoles.length>0) {
        ///important
            // if (route.data.roles && ((route.data.roles).filter(x=>x ==user).length!==0)) {
            //     return true;
            // }

            if(route.data.roles && route.data.roles.filter(value => userRoles.includes(value))){
                return true; 
            } 
            this.router.navigate(['/']);
            return false;
        }
        //localStorage.setItem('prevPath',state.url)
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;


    }
}