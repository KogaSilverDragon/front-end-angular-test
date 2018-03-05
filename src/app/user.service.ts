import { Injectable } from '@angular/core';
import {User} from './app.component';
import { environment } from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

let userListCache: User[] = null;

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList(): Observable<User[]> {
    if (!userListCache) {
      console.log('No cache');
      return this.http.get<User[]>(environment.userListURL).map(_userList => {
        userListCache = _userList;
        return userListCache;
      });
    } else {
      return Observable.of(userListCache);
    }
  }

  getUser(_id: number): Observable<User> {
    return this.getUserList().map(
      _userList => {
        return _userList.find(user => user.id === _id);
      }
    ).catch(
      _error => {
        console.error(_error);
        return Observable.of<User>();
      }
    );
  }

  updateUser(user: User): void {
    console.log(userListCache);
      userListCache.some(_user => {
      if (_user.id === user.id) {
        _user = user;
        return true;
      } else {
        return false;
      }
    });
    console.log(userListCache);
  }

  removeUser(user: User): void {
    userListCache = userListCache.filter(_user => _user.id !== user.id);
  }

  removeUsers(users: User[]): void {
    users.forEach(user => this.removeUser(user));
  }

}
