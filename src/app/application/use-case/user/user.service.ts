import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = environment.baseURL;

  constructor( private http: HttpClient ) { }

  verifyUsername( username: string ) {
    const url = `${ this.baseURL }/users/exist-name?name=${ username }`;
    return this.http.get( url );
  }

  createUser( body: any ) {
    const url = `${ this.baseURL }/users/create`;
    return this.http.post( url, body );
  }

  loginUser( body: { username: string, password: string } ) {
    const url = `${ this.baseURL }/users/login`;
    return this.http.post( url, body );
  }
}
