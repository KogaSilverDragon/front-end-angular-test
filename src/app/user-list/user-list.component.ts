import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../app.component';
import {UserService} from '../user.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private _userList: User[] = [];
  get userList(): User[] { return this._userList };
  userList$: Observable<User[]>;
  selectAll = false;
  filterName = '';
  filterName$: Subject<string> = new Subject<string>();

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserList().toPromise().then(
      _userList => {
        this._userList = _userList;
        this.filterUsers();
      },
      _error => console.log(_error)
    );

    this.userList$ = this.filterName$
      .switchMap(name => {
        if (!name) {
          return Observable.of<User[]>(this._userList);
        } else {
          return Observable.of<User[]>(
            this._userList.filter(_user => {
              return _user.firstName.toLowerCase().indexOf(name.toLowerCase()) != -1 ||
                     _user.lastName.toLowerCase().indexOf(name.toLowerCase()) != -1;
            })
          );
        }
      }).catch(error => {
        console.log(error);
        return Observable.of<User[]>([]);
      });
  }
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this._userList.forEach(user => user.selected = this.selectAll);
  }

  updateSelectAll(): void {
    this.selectAll = this._userList.every(user => user.selected);
  }

  filterUsers(): void {
    this.filterName$.next(this.filterName);
  }

  showUser(user: User): void {
    if (!user || !user.id) { return; }

    this.router.navigate(['/user', user.id]);
  }

  deleteUser(user: User): void {
    if (!user || !user.id) { return; }
    this.userService.removeUser(user);
    this._userList = this._userList.filter(_user => _user.id !== user.id);
    this.filterUsers();
  }

  deleteSelectedUsers(): void {
    this.userService.removeUsers(this._userList.filter(user => user.selected));
    this._userList = this._userList.filter(user => !user.selected);
    this.filterUsers();
  }

  selectedUsersCount(): number {
    return this._userList.filter(user => user.selected).length;
  }

  hasSelectedUsers(): boolean {
    return this._userList.some(user => user.selected);
  }

  download(): void {
    const users: User[] = this._userList.filter(user => user.selected);
    const filename = 'users.json';
    if (!users.length) { return; }

    const blob = new Blob([JSON.stringify(users)], {type: 'application/json'});
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

}
