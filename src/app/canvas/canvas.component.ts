import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridNode, Grid, EqGroup, GroupTypeEnum } from '../grid';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {

  private width: number;
  private height: number;
  private xCanvasOffset: number;
  private yCanvasOffset: number;
  private shapeSize: number;

  private equation: EqGroup;
  private grid: Grid;

  @ViewChild('gameCanvas', {static: false, read: ElementRef}) canvas: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(private gridService: GridService) {}

  ngAfterViewInit(): void {
    this.width = this.canvas.nativeElement.width = window.innerWidth - this.canvas.nativeElement.offsetLeft;
    this.height = this.canvas.nativeElement.height = window.innerHeight - this.canvas.nativeElement.offsetTop;

    this.xCanvasOffset = this.canvas.nativeElement.offsetLeft;
    this.yCanvasOffset = this.canvas.nativeElement.offsetTop;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.shapeSize = this.height / 10;

    const startingEquation = "ax + b";
    this.equation = this.gridService.parseEquation(startingEquation);
    this.grid = this.gridService.convertEquationToGrid(this.equation,
                                           this.width,
                                           this.height,
                                           this.xCanvasOffset,
                                           this.yCanvasOffset);

    this.runGame();
  }

  runGame() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawEquationGrid(this.grid.nodes);
  }

  drawEquationGrid(nodeArray: GridNode[]) {
    for (let n in nodeArray) {
      let equationNode: GridNode = nodeArray[n];
      if (equationNode.grid) {
        this.context.fillStyle = "yellow";
        this.context.fillRect(equationNode.x, equationNode.y, equationNode.grid.width, equationNode.grid.height);
        this.drawEquationGrid(equationNode.grid.nodes);
      } else {
        this.context.fillStyle = "blue";
        this.context.fillRect(equationNode.x - this.shapeSize / 2, equationNode.y - this.shapeSize / 2, this.shapeSize, this.shapeSize);
      }
    }
  }


  placeShape(event: MouseEvent) {
    //const coord = {x: event.x - this.xCanvasOffset, y: event.y - this.yCanvasOffset};
    //const node: GridNode = this.gridService.getClosestNode(coord);
    //console.log(node, coord);

    //this.drawRectangle(node, "blue");
  }

  /** ToDo: Drag'n drop les rectangles pour sélectionner des régions
  * Permettrait de sélectionner des bouts d'éq et de les déplacer en groupe
  */
  drawRectangle(x: number, y: number, color: string) {
    x = x - this.xCanvasOffset - (this.shapeSize / 2);
    y = y - this.yCanvasOffset - (this.shapeSize / 2);

    this.context.fillStyle = color || "red";
    this.context.fillRect(x, y, this.shapeSize, this.shapeSize);
  }
}
