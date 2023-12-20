import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  private canvasWidth: number;
  private canvasHeight: number;
  private xCanvasOffset: number;
  private yCanvasOffset: number;

  @ViewChild('gameCanvas', {static: false, read: ElementRef}) canvas: ElementRef;
  context: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerWidth - this.canvas.nativeElement.offsetLeft;
    this.canvas.nativeElement.height = window.innerHeight - this.canvas.nativeElement.offsetTop;

    this.xCanvasOffset = this.canvas.nativeElement.offsetLeft;
    this.yCanvasOffset = this.canvas.nativeElement.offsetTop;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.runGame();
  }

  private runGame() {
    console.log("It's on!");
    console.log(this.context);
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  /** ToDo: Drag'n drop les rectangles pour sélectionner des régions
  * Permettrait de sélectionner des bouts d'éq et de les déplacer en groupe
  */
  drawRectangle(event: MouseEvent) {
    const shapeSize = this.context.canvas.height / 10;

    const ratio = 10;
    const x = event.x - this.xCanvasOffset - (shapeSize / 2);
    const y = event.y - this.yCanvasOffset - (shapeSize / 2);

    this.context.fillStyle = "red";
    this.context.fillRect(x, y, shapeSize, shapeSize);
  }
}
