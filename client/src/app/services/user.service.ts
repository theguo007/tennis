import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {User} from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserService {

  users: any;
  urlPrefix = "http://localhost:3001/api";
  constructor(private http:Http,
              private authService: AuthService) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.prepEndpoint("users"), {headers: this.authService.getAuthHeaders()})
        .map((response: Response) => <User[]>response.json())
        .catch(this.handleError);
  }

  getProfile(){    
    return this.http.get(this.prepEndpoint("profile"), {headers: this.authService.getAuthHeaders()})
      .map(res => res.json());
  }

  editUser(id: number, data: object): Observable<any>{
      return this.http.put(this.prepEndpoint('users/' + id.toString() + '/edit'), JSON.stringify(data), {headers:this.authService.getAuthHeaders()})
        .map(res => res.json())
        .catch(this.handleError);
  }

  findUser(id: number): Observable<User>{
    return this.http.get(this.prepEndpoint('users/'+ id.toString()), {headers: this.authService.getAuthHeaders()})
        .map((response: Response) => <User>response.json())
        .catch(this.handleError);
  }

  createUser(data: object): Observable<any>{
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post(this.prepEndpoint('users'), JSON.stringify(data), {headers:headers})
        .map(res => res.json())
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  prepEndpoint(x: string){
    return this.urlPrefix+ "/" + x;
  }

}
