import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {User} from '../models/user';

@Injectable()
export class UserService {

  users: any;

  constructor(private http:Http) { }

  getUsers(): Observable<User[]> {
    return this.http.get("http://localhost:3001/api/users")
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
