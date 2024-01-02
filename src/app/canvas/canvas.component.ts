import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Grid, EqGroup, GroupTypeEnum } from '../grid';
import { GridService } from '../grid.service';
import { MouseService } from '../mouse.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  equationString: string = 'a*x + b = c/3 + 1';

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

  constructor(private gridService: GridService, private mouse: MouseService) {}


  ngAfterViewInit(): void {
    this.width = this.canvas.nativeElement.width = window.innerWidth - this.canvas.nativeElement.offsetLeft;
    this.height = this.canvas.nativeElement.height = window.innerHeight - this.canvas.nativeElement.offsetTop;

    this.xCanvasOffset = this.canvas.nativeElement.offsetLeft;
    this.yCanvasOffset = this.canvas.nativeElement.offsetTop;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.shapeSize = this.height / 10;

    this.equation = this.gridService.parseEquation(this.equationString, GroupTypeEnum.eq);
    console.log(this.equation);
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
    if (this.mouse.isDragging ) {
      this.animateDrag(closestNode.x, closestNode.y, this.draggedNode.x, this.draggedNode.y)
    } else {
      this.draggedNode = closestNode;
      this.animateDrag(x, y, this.draggedNode.x, this.draggedNode.y);
    }
    this.mouse.handleMouseEvent(event);
  }

  onMouseMove(event: any): void {
    if (!this.mouse.isDragging) {
      return;
    }
    const x = event.x - this.xCanvasOffset;
    const y = event.y - this.yCanvasOffset;
    this.animateDrag(x, y, this.draggedNode.x, this.draggedNode.y);
  }

  animateDrag(x: number, y: number, x0: number, y0: number) {
    const initialVariableColor = "green"
    const draggedVariableColor = "yellow"
    this.reprint();
    this.drawVariable(x0, y0, initialVariableColor);
    this.drawVariable(x, y, draggedVariableColor);
  }

  drawVariable(x: number, y: number, color: string) {
    this.context.fillStyle = color || this.defaultVariableColor;
    this.context.fillRect(x - this.shapeSize/2, y - this.shapeSize/2, this.shapeSize, this.shapeSize);
  }

  reprint() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawEquationGrid(this.grid, true);
  }

  runGame() {
    this.reprint();
  }

  drawEquationGrid(grid: Grid, drawEqualSign?: boolean) {
    if (drawEqualSign) {
      const eqNode: Grid = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        nodes: [],
        operator: GroupTypeEnum.eq,
      }
      this.drawOperator(eqNode);
    }

    grid.nodes.forEach((node) => {
      if (node.operator === GroupTypeEnum.var) {
        const x = node.x;
        const y = node.y;
        this.drawVariable(x, y, "blue");
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
