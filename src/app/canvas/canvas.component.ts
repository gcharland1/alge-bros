import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

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

  private runGame() {
    console.log("It's on!");
  }

  /** ToDo: Drag'n drop les rectangles pour sélectionner des régions
  * Permettrait de sélectionner des bouts d'éq et de les déplacer en groupe
  */
  drawRectangle(x0: number, y0: number, width: number, height: number, color: string) {
    this.context.fillStyle = color
    this.context.fillRect(x0, y0, width, height);
  }
}
