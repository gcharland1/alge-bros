import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AlgebraService } from '../algebra.service';
import { Grid, EqGroup, GroupTypeEnum } from '../grid';
import { GridService } from '../grid.service';
import { MouseService } from '../mouse.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  equationString: string = 'a*b + x = c/3 + x';

  private width: number;
  private height: number;
  private xCanvasOffset: number;
  private yCanvasOffset: number;
  private shapeSize: number;

  private equation: EqGroup;
  private grid: Grid;

  private draggedNode: Grid;

  private defaultVariableColor = "blue";

  @ViewChild('gameCanvas', {static: false, read: ElementRef}) canvas: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(private gridService: GridService,
              private mouse: MouseService,
              private algebraService: AlgebraService) {}


  ngAfterViewInit(): void {
    this.width = this.canvas.nativeElement.width = window.innerWidth - this.canvas.nativeElement.offsetLeft;
    this.height = this.canvas.nativeElement.height = window.innerHeight - this.canvas.nativeElement.offsetTop;

    this.xCanvasOffset = this.canvas.nativeElement.offsetLeft;
    this.yCanvasOffset = this.canvas.nativeElement.offsetTop;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.shapeSize = this.height / 10;

    this.equation = this.gridService.parseEquation(this.equationString, GroupTypeEnum.eq);
    this.grid = this.gridService.convertEquationToGrid(this.equation,
                                           this.width,
                                           this.height,
                                           0,
                                           0);
    this.runGame();
  }

  onSumbit(event: any): void {
    this.equationString = event.target.value;
    this.equation = this.gridService.parseEquation(this.equationString, GroupTypeEnum.eq);
    this.grid = this.gridService.convertEquationToGrid(this.equation, this.width, this.height, 0, 0);
    this.reprint();
  }

  onMouseClick(event: any): void {
    const x = event.x - this.xCanvasOffset;
    const y = event.y - this.yCanvasOffset;
    const closestNode: Grid = this.gridService.getClosestNode(this.grid, x, y);
    console.log(closestNode);
    const mouseNode = {
      x,
      y,
      width: 0,
      height: 0,
    }
    if (this.mouse.isDragging) {
      console.log("Swap!");
      this.grid = this.algebraService.swapVariabe(this.draggedNode, this.grid);
      console.log(this.grid);
      this.reprint();
      this.animateDrag(closestNode, this.draggedNode)
      this.mouse.handleMouseEvent(event);
    } else if (this.algebraService.isMoveableVariable(closestNode, this.grid)) {
      this.draggedNode = closestNode;
      this.animateDrag(mouseNode, closestNode);
      this.mouse.handleMouseEvent(event);
    }
  }

  onMouseMove(event: any): void {
    if (!this.mouse.isDragging) {
      return;
    }
    const mouseNode: Grid = {
      x: event.x - this.xCanvasOffset,
      y: event.y - this.yCanvasOffset,
      width: 0,
      height: 0,
    }
    this.animateDrag(mouseNode, this.draggedNode);
  }

  animateDrag(draggedNode: Grid, initialNode: Grid) {
    const initialVariableColor = initialNode.isX ? "#aa5555" : "green"
    const draggedVariableColor = initialNode.isX ? "#ff3333" : "yellow"

    this.reprint();
    this.drawVariable(initialNode, initialVariableColor);
    this.drawVariable(draggedNode, draggedVariableColor);
  }

  drawVariable(node: Grid, color?: string) {
    const _color = node.isX ? "red" : color || this.defaultVariableColor;
    this.context.fillStyle = _color;

    const x = node.x - this.shapeSize/2;
    const y = node.y - this.shapeSize/2;
    this.context.fillRect(x, y, this.shapeSize, this.shapeSize);
  }

  reprint() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawEquationGrid(this.grid);
  }

  runGame() {
    this.reprint();
  }

  drawEquationGrid(grid: Grid) {
    if (grid.operator === GroupTypeEnum.eq) {
      this.drawOperator(grid);
    }

    grid.nodes.forEach((node) => {
      if (node.operator === GroupTypeEnum.var) {
        this.drawVariable(node);
      } else {
        this.drawOperator(node);
        this.drawEquationGrid(node);
      }
    });
  }

  drawOperator(node: Grid) {
    const numberOfElements = node.nodes.length || 2;

    for (let i=1; i<numberOfElements; i++) {
      let operatorX: number, operatorY:number;
      if (this.gridService.horizontalTypesList.includes(node.operator)) {
        operatorX = (1 - i/numberOfElements)*node.width + node.x;
        operatorY = node.height/2 + node.y;
      } else {
        operatorX = node.width/2 + node.x;
        operatorY = (1 - i/numberOfElements)*node.height + node.y;
      }
      this.drawMathOperator(node.operator, operatorX, operatorY, "black");
    }
  }

  drawMathOperator(op: GroupTypeEnum, x: number, y: number, color: string) {
    this.context.fillStyle = color || "black";
    this.context.font = "48px mono";
    const operatorSize = 25;

    x = x - operatorSize / 2;
    y = y + operatorSize / 2;
    switch (op) {
      case GroupTypeEnum.add:
        this.context.fillText("+", x, y);
        break;
      case GroupTypeEnum.div:
        this.context.fillText("/", x, y);
        break;
      case GroupTypeEnum.mul:
        this.context.fillText("x", x, y);
        break;
      case GroupTypeEnum.eq:
        this.context.fillText("=", x, y);
    }
  }
}
