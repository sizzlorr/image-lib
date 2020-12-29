import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ImagesService } from '../services/images.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

export interface ImageData {
  pictures: Picture[];
  page: number;
  pageCount: number;
  hasMore: boolean;
  zoomPosition: any;
}

export interface Picture {
  id: string;
  cropped_picture: string;
  author: string;
  camera: string;
  full_picture: string;
  tags: string;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {
  @ViewChild('imageModal') imageModal: TemplateRef<any>;

  private subscriptions$ = new Subscription();
  pageData$: ImageData;
  selectedImage: Picture;
  dialogRef: any;
  zoom = 1;
  picPos: number;

  constructor(private imagesService: ImagesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.subscriptions$.add(this.imagesService.viewUserIsLogged.subscribe(status => {
      if (status) {
        this.imagesService.getImages();
        this.getPageData();
      }
    }));
  }

  setPage(pageNumber: number) {
    this.imagesService.getImages(pageNumber);
  }

  openImage(selectedImage: Picture) {
    this.picPos = this.pageData$.pictures.findIndex(p => p.id === selectedImage.id);
    this.selectedImage = selectedImage;
    this.dialogRef = this.dialog.open(this.imageModal, {
      maxHeight: '90vh'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.zoom = 1;
    });
  }

  zoomIn() {
    this.zoom += .5;
  }

  resetZoom() {
    this.zoom = 1;
  }

  zoomOut() {
    if (this.zoom === .5) {
      return;
    }
    this.zoom -= .5;
  }

  prevPic() {
    this.picPos -= 1;
    this.selectedImage = this.pageData$.pictures[this.picPos];
  }

  nextPic() {
    this.picPos += 1;
    this.selectedImage = this.pageData$.pictures[this.picPos];
  }

  shareImg() {
    console.log('Share --> ', this.selectedImage.full_picture);
  }

  private getPageData() {
    this.subscriptions$.add(this.imagesService.images$.subscribe((pageData: ImageData) => {
      this.pageData$ = pageData;
    }));
  }

  ngOnDestroy() {
    try {
      this.subscriptions$.unsubscribe();
    } catch (e) {}
  }
}
