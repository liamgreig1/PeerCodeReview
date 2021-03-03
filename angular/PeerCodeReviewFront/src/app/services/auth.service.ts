import { Injectable } from '@angular/core';
import * as moment from "moment";
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

    constructor() {}
          
    setLocalStorage(responseObj) {
        const expiresAt = moment().add(responseObj.expiresIn);

        localStorage.setItem('id_token', responseObj.token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    doesTokenExist() {
        if(localStorage.length == 0){
            return false;
        }
    }

    isTokenExpired(){
        const expiry = this.getExpiration();
        return (Math.floor((new Date).getTime() / 1000)) > expiry.unix();
    }
}