import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private subject = new BehaviorSubject<any>([]);
  images$: Observable<any> = this.subject.asObservable();
  private authStatus$ = new BehaviorSubject<boolean>(false);
  private url = 'http://interview.agileengine.com';
  private token: string;

  constructor(private http: HttpClient) { }

  auth() {
    this.http.post<{ auth: boolean, token: string }>(`${this.url}/auth`, { apiKey: '23567b218376f79d9415' })
      .pipe(
        tap(() => console.log('Auth'))
      )
      .subscribe(authData => {
        if (authData.auth) {
          this.token = authData.token;
          this.userIsLogged(true);
        } else {
          throw new Error('Auth Failed');
        }
      }, error => {
        console.error('Error while auth', error);
      });
  }

  userIsLogged(status: boolean) {
    this.authStatus$.next(status);
  }

  get viewUserIsLogged() {
    return this.authStatus$.asObservable();
  }

  getImages(page: number = 1) {
    return this.http.get<any>(`${this.url}/images?page=${page}`, { headers: { Authorization: `Bearer ${this.token}` } })
      .subscribe(pageData => {
        this.getAdditionalData(pageData);
      });
  }

  getAdditionalData(pageData: any) {
    const updatedPictures = [...pageData.pictures];
    updatedPictures.forEach((pic, index) => {
      let patchedPic = {};

      this.http.get<any>(`${this.url}/images/${pic.id}`, { headers: { Authorization: `Bearer ${this.token}` } })
        .subscribe(addData => {
          patchedPic = {
            ...pic,
            ...addData
          };

          updatedPictures[index] = patchedPic;

          this.subject.next({
            ...pageData,
            pictures: updatedPictures
          });
        });
    });
  }
}
