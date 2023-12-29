import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenLocalStorageService } from '../tokenLocalStorage/tokenLocalStorageService';



@Injectable({ providedIn: 'root' })
export class IsLoggedIn implements CanActivate {
    constructor(
        private router: Router,
        private storage: TokenLocalStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('allRoles') != null) {
            this.router.navigate(['auth/onboardinglist']);
            return false;
        }
        else {
            return true;
        }
    }
}