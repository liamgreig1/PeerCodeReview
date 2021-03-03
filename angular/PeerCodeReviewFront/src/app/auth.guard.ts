import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(this.authService.isTokenActive());
    // console.log(this.authService.doesTokenExist());
    if(this.authService.isTokenActive()){
      if(this.authService.doesTokenExist()){
        return true;
      }else{
        this.authService.logout();
        return false;
      }
    }else{
      return false;
    }
  }
}
