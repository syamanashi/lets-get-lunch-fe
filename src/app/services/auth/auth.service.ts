import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

import { LoginResponse, SignupResponse, User } from './';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

  login(credentials: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8080/api/sessions', credentials).pipe(
      tap((res: LoginResponse) => this.localStorage.store('Authorization', res.token))
    );
  }

  signup(credentials: User): Observable<LoginResponse> {
    return this.http.post<SignupResponse>('http://localhost:8080/api/users', credentials).pipe(
      mergeMap((res: SignupResponse) => this.login(credentials)) // Uses mergeMap to merge the observable returned from login into the observable returned by signup therefore returning a single observable.
    );
  }

}
