import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridNode, Grid } from '../grid';
import { GridService } from '../grid.service';

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
  private shapeSize: number;
  private grid: Grid;

  @ViewChild('gameCanvas', {static: false, read: ElementRef}) canvas: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(private gridService: GridService) {}

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerWidth - this.canvas.nativeElement.offsetLeft;
    this.canvas.nativeElement.height = window.innerHeight - this.canvas.nativeElement.offsetTop;

    this.xCanvasOffset = this.canvas.nativeElement.offsetLeft;
    this.yCanvasOffset = this.canvas.nativeElement.offsetTop;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.shapeSize = this.context.canvas.height / 10;

    this.gridService.generateGrid();

    this.runGame();
  }

  runGame() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  placeShape(event: MouseEvent) {
    const coord = {x: event.x - this.xCanvasOffset, y: event.y - this.yCanvasOffset};
    const node: GridNode = this.gridService.getClosestNode(coord);

    this.drawRectangle(node, "blue");
  }

  /** ToDo: Drag'n drop les rectangles pour sélectionner des régions
  * Permettrait de sélectionner des bouts d'éq et de les déplacer en groupe
  */
  drawRectangle(node: GridNode, color: string) {
    const x = node.x - this.xCanvasOffset - (this.shapeSize / 2);
    const y = node.y - this.yCanvasOffset - (this.shapeSize / 2);

    this.context.fillStyle = color || "red";
    this.context.fillRect(x, y, this.shapeSize, this.shapeSize);
  }
}
