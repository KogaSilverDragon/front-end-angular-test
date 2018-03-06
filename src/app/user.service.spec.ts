import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientModule} from "@angular/common/http";
import {APP_BASE_HREF} from "@angular/common";

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [UserService, {provide: APP_BASE_HREF, useValue: '/'}]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should get and cache users', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      expect(response).toBeDefined();
    });
    expect(service.getCachedUserList()).toBeDefined();
  }));

  it('should get user by id', inject([UserService], (service: UserService) => {
    service.getUser(1).toPromise().then(response => {
      expect(response).toBeDefined();
    });
  }));

  it('should throw an exception if a invalid id is provided to get the user', inject([UserService], (service: UserService) => {
    const id = 999;
    service.getUser(id).toPromise().then(response => {
      expect(response).toThrow(`No user found with id ${id}.`);
      expect(response).toBeNull();
    });
  }));

  it('should update user', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      let user = response[0];
      user.firstName = 'João';
      user.lastName = 'Silva';
      service.updateUser(user);

      service.getUser(user.id).toPromise().then(response => {
        expect(response).toBe(user);
      });
    });
  }));

  it('should throw an exception if a invalid id is provided to update the user', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      let user = response[0];
      user.firstName = 'João';
      user.lastName = 'Silva';
      user.id = 999;

      expect(service.updateUser(user)).toThrow(`No user found with id ${user.id}.`);
      expect(response).toBeNull();
    });
  }));

  it('should delete the user', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      const user = response[0];
      service.removeUser(user);

      service.getUser(user.id).toPromise().then(response => {
        expect(response).toThrow(`No user found with id ${user.id}.`);
        expect(response).toBeNull();
      });
    });
  }));

  it('should throw an exception if a invalid id is provided to delete the user', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      let user = response[0];
      user.id = 999;

      expect(service.removeUser(user)).toThrow(`No user found with id ${user.id}.`);
    });
  }));

  it('should remove the users', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      const users = response.slice(0, 3);
      service.removeUsers(users);

      users.forEach(user => {
        service.getUser(user.id).toPromise().then(response => {
          expect(response).toThrow(`No user found with id ${user.id}.`);
          expect(response).toBeNull();
        });
      });
    });
  }));

  it('should throw an exception if a invalid id is provided to remove the users', inject([UserService], (service: UserService) => {
    service.getUserList().toPromise().then(response => {
      let users = response.slice(0, 3);
      users[1].id = 999;

      expect(service.removeUsers(users)).toThrow(`No user found with id ${users[1].id}.`);
    });
  }));
});
