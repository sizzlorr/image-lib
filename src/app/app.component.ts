import { Component, OnInit } from '@angular/core';
import { ImagesService } from './services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private imagesService: ImagesService) { }

  ngOnInit() {
    this.imagesService.auth();
  }
}
