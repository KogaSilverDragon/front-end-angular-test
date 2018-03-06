import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {UserInfoComponent} from "../user-info/user-info.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../user.service";
import {AppComponent} from "../app.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppRoutingModule} from "../app-routing.module";
import {APP_BASE_HREF} from "@angular/common";

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        UserListComponent,
        UserInfoComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule.forRoot(),
        AppRoutingModule
      ],
      providers: [UserService, {provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('userList and userList$ should be initialized', inject([UserService], (service: UserService) => {
    component.ngOnInit();
    service.getUserList().toPromise().then(response => {
      expect(component.userList).toBe(response);
    });
    expect(component.userList$).toBeDefined();
  }));

  it('should count the users', inject([UserService], (service: UserService) => {
    component.ngOnInit();
    service.getUserList().toPromise().then(response => {
      expect(component.selectedUsersCount()).toBe(0);
      console.log('count', component.userList);
      component.userList[0].selected = true;
      expect(component.selectedUsersCount()).toBe(1);
      component.userList[1].selected = true;
      expect(component.selectedUsersCount()).toBe(2);
    });
  }));

  it('should toggle all the users', () => {
    component.ngOnInit();
    component.toggleSelectAll();
    expect(component.selectedUsersCount()).toBe(component.userList.length);
    component.toggleSelectAll();
    expect(component.selectedUsersCount()).toBe(0);
  });

  it('should update the selectAll', inject([UserService], (service: UserService) => {
    component.ngOnInit();
    service.getUserList().toPromise().then(response => {
      component.toggleSelectAll();
      component.userList[0].selected = false;
      component.updateSelectAll();
      expect(component.selectAll).toBeFalsy();
      component.userList[0].selected = true;
      component.updateSelectAll();
      expect(component.selectAll).toBeTruthy();
    });
  }));

  it('should filter the users by name', inject([UserService], (service: UserService) => {
    component.ngOnInit();
    service.getUserList().toPromise().then(response => {
      expect(component.selectedUsersCount()).toBe(component.userList.length);
      component.filterName = 'Mary';
      component.filterUsers();
      component.userList$.toPromise().then(userList => {
        expect(component.selectedUsersCount).toBe(1);
      })
    });
  }));
});
