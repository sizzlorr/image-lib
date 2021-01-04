import { Injectable } from '@angular/core';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, ReplaySubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://interview.agileengine.com';
  token$: ReplaySubject<string> = new ReplaySubject(1);
  token: Observable<any> = this.token$.asObservable();
  private authStatus$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.auth();
  }

  auth() {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      this.token$.next(authToken);
      this.userIsLogged(true);
    } else {
      this.http.post<{ auth: boolean, token: string }>(`${this.url}/auth`, { apiKey: '23567b218376f79d9415' })
        .pipe(
          tap(() => console.log('Auth'))
        )
        .subscribe(authData => {
          if (authData.auth) {
            this.token$.next(authData.token);
            localStorage.setItem('token', authData.token);
            this.userIsLogged(true);
          } else {
            throw new Error('Auth Failed');
          }
        }, error => {
          console.error('Error while auth', error);
        });
    }
  }

  userIsLogged(status: boolean) {
    this.authStatus$.next(status);
  }

  get viewUserIsLogged() {
    return this.authStatus$.asObservable();
  }
}
