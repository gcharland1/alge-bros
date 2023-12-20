import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  private canvasWidth: number;
  private canvasHeight: number;


  @ViewChild('gameCanvas', {static: false, read: ElementRef}) canvas: ElementRef;
  context: CanvasRenderingContext2D;


  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvasHeight = this.context.canvas.height;
    this.canvasWidth = this.context.canvas.width;
    this.runGame();
  }

  runGame() {
    this.fillRect(0, 0, this.canvasWidth, this.canvasHeight, "#10d050");
  }


  private fillRect(x0: number, y0: number, width: number, height: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x0, y0, width, height);
  }
}
