import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../app.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: User;
  userForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private modalService: NgbModal) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id).toPromise().then(_user => this.user = _user);
  }

  edit(): void {
    this.userForm = this.fb.group({
      firstName: [
        this.user.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      lastName: [
        this.user.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      age: [
        this.user.age,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(200)
        ]
      ],
      description: [
        this.user.description,
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(500)
        ]
      ]
    });
  }

  save(content): void {
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      Object.keys(this.userForm.value).forEach(key => {
        this.user[key] = this.userForm.value[key];
      });
      this.userService.updateUser(this.user);
      this.userForm = null;
    }, (reason) => {
      console.log(reason);
    });
  }

  cancel(): void {
    this.userForm = null;
  }

}
