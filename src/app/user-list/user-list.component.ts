import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../app.component";
import {UserService} from "../user.service";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userList: User[] = [];
  userList$: Observable<User[]>;
  selectAll: boolean = false;
  filterName: string = '';
  filterName$: Subject<string> = new Subject<string>();

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserList().toPromise().then(
      _userList => {
        this.userList = _userList;
        this.filterUsers();
      },
      _error => console.log(_error)
    );

    this.userList$ = this.filterName$
      .switchMap(name => {
        if (!name) {
          return Observable.of<User[]>(this.userList);
        } else {
          return Observable.of<User[]>(
            this.userList.filter(_user => {
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
    this.userList.forEach(user => user.selected = this.selectAll);
  }

  updateSelectAll(): void {
    this.selectAll = this.userList.every(user => user.selected);
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
    this.userList = this.userList.filter(_user => _user.id !== user.id);
    this.filterUsers();
  }

  deleteSelectedUsers(): void {
    this.userService.removeUsers(this.userList.filter(user => user.selected));
    this.userList = this.userList.filter(user => !user.selected);
    this.filterUsers();
  }

  hasSelectedUsers(): boolean {
    return this.userList.some(user => user.selected);
  }

  download(): void {
    let users: User[] = this.userList.filter(user => user.selected);
    const filename: string = 'users.json';
    if (!users.length) { return; }

    let blob = new Blob([JSON.stringify(users)], {type: 'application/json'});
    let e = document.createEvent('MouseEvents');
    let a = document.createElement('a');

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else{
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['application/json', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

}
