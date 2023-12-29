import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MouseService {

  x0: number = 0;
  y0: number = 0;
  x1: number = 0;
  y1: number = 0;

  isDragging: boolean = false;

  constructor() {
  }

  handleMouseEvent(event: MouseEvent) {
    console.log(event);
    switch (event.buttons) {
      case 1:
        this.onclick(event);
        break;
    }
  }

  onclick(event: MouseEvent) {
    if (this.isDragging) {
      this.x1 = event.x;
      this.y1 = event.y;
      this.isDragging = false;
    } else {
      this.x0 = event.x;
      this.y0 = event.y;
      this.isDragging = true;
    }

  }

  getPosition() { }
}
