import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private subject = new BehaviorSubject<any>([]);
  images$: Observable<any> = this.subject.asObservable();
  private url = 'http://interview.agileengine.com';
  private token: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.token.subscribe(token => {
      this.token = token;
    });
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
