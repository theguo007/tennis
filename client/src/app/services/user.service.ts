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
  urlPrefix = "http://localhost:3001/api";
  constructor(private http:Http) { }



  getUser(id: number): Observable<User>{
    return this.http.get(this.urlPrefix+'/users/'+ id.toString())
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
  }

  createUser(data: object): Observable<any>{
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(this.urlPrefix+'/users', JSON.stringify(data), {headers:headers})
        .map(res => res.json())
        .catch(this.handleError);
  }



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
