import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";
import {User} from "../app.component";

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    let id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id).toPromise().then(_user => this.user = _user);
  }

}
