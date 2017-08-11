import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import {User} from '../models/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  prefix = "http://localhost:3001/api/";

  constructor(private http: Http) { }

  authenticateUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.prefix + 'authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user_email', user.email);
    this.authToken = token;
    this.user = user;
  }

   getUsers(): Observable<User[]> {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get(this.prepEndpoint("users"), {headers: headers})
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError);
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('users/profile');
    return this.http.get(ep,{headers: headers})
      .map(res => res.json());
  }

  editUser(id: number, data: object): Observable<any>{
      var headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.put(this.prepEndpoint('users/' + id.toString() + '/edit'), JSON.stringify(data), {headers:headers})
        .map(res => res.json())
        .catch(this.handleError);
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  prepEndpoint(x: string){
    return this.prefix+x;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
