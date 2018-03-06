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

  getCachedUserList(): User[] {
    return userListCache;
  }

  getUserList(): Observable<User[]> {
    if (!userListCache) {
      console.log('No cache.');
      return this.http.get<User[]>(environment.userListURL).map(_userList => {
        console.log('Caching...');
        userListCache = _userList;
        return userListCache;
      });
    } else {
      console.log('Getting list from cache.');
      return Observable.of(userListCache);
    }
  }

  getUser(_id: number): Observable<User|null> {
    return this.getUserList().map(
      _userList => {
        try {
          let user = _userList.find(user => user.id === _id);
          if (!user) {
            throw new Error(`No user found with id ${_id}.`);
          }
          return user
        } catch (e) {
          console.error(e.message);
          return null;
        }
      }
    ).catch(
      _error => {
        console.error(_error);
        return Observable.of<User>();
      }
    );
  }

  updateUser(user: User): void {
    try {
      let found = userListCache.some(_user => {
        if (_user.id === user.id) {
          _user = user;
          return true;
        } else {
          return false;
        }
      });
      if (!found) {
        throw new Error(`No user found with id ${user.id}.`);
      } else {
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  removeUser(user: User): void {
    try {
      const filteredList = userListCache.filter(_user => _user.id !== user.id);

      if (filteredList.length === userListCache.length) {
        throw new Error(`No user found with id ${user.id}.`);
      } else {
        userListCache = filteredList;
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  removeUsers(users: User[]): void {
    try {
      users.forEach(user => this.removeUser(user));
    } catch (e) {
      console.error(e.message);
    }
  }

}
