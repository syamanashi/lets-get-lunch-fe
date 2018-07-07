import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

import { AuthService, LoginResponse, SignupResponse, User } from './';
import { Observable } from 'rxjs/internal/Observable';

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;
  let localStorage: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, LocalStorageService]
    });

    authService = TestBed.get(AuthService);
    http = TestBed.get(HttpTestingController);
    localStorage = TestBed.get(LocalStorageService); // Gets a local instance of the injected service into our test
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('signup', () => {
    it('should return a token with a valid username and password', () => {
      const user: User = { username: 'myUser', password: 'password' };
      const signupResponse: SignupResponse = {
        _v: 0,
        username: 'myUser',
        password: '$2a$10$oF7YW1FyOSW3Gw7G4ThbO.ibduCgF3U0gVI/GE9fKQcGtVEBs0B.2',
        _id: '5a550ea739fbc4ca3ee0ce58',
        dietPreferences: [],
      };
      const loginResponse: LoginResponse = { token: 's3cr3tt0ken' };
      let response;

      authService.signup(user).subscribe(res => {
        response = res;
      });
      spyOn(authService, 'login').and.callFake(() => of(loginResponse)); // Within the scope of testing signup we’re only concerned that signup calls login and receives a response from login.

      http.expectOne('http://localhost:8080/api/users').flush(signupResponse);
      expect(response).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalled();
      http.verify();
    });

    it('should return an error for an invalid object', () => {
      const user: User = { username: 'myUser', password: 'pswd' };
      const signupResponseMsg = 'Your password must be at least 5 characters long.';
      let errorResponse: HttpErrorResponse;

      authService.signup(user).subscribe(res => {}, (err: HttpErrorResponse) => {
        errorResponse = err;
      });

      http
        .expectOne('http://localhost:8080/api/users')
        .flush({ message: signupResponseMsg }, { status: 400, statusText: 'Bad Request' });

      expect(errorResponse.error.message).toEqual(signupResponseMsg);
      http.verify();
    });
  });

  describe('login', () => {
    it('should return a token with a valid username and password', () => {
      const user: User = { username: 'myUser', password: 'password' };
      const loginResponse: LoginResponse = { token: 's3cr3tt0ken' };
      let response: LoginResponse;

      authService.login(user).subscribe(res => {
        response = res;
      });

      http.expectOne('http://localhost:8080/api/sessions').flush(loginResponse);
      expect(response).toEqual(loginResponse);
      expect(localStorage.retrieve('Authorization')).toEqual('s3cr3tt0ken');
      http.verify();
    });
  });
});
