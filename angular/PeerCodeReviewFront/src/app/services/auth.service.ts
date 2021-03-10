import { Injectable } from '@angular/core';
import * as moment from "moment";
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

    constructor() {}
          
    setLocalStorage(responseObj) {
        const expiresAt = moment().add(15,'m').toDate();

        localStorage.setItem('id_token', responseObj.token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }   
    
    getUserId(){
        var token = localStorage.getItem('id_token');
        var decoded = jwt_decode(token); 
        return decoded['sub'];
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
        else{
            return true;
        }
    }
}