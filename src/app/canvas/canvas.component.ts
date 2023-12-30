import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridNode, Grid, EqGroup, GroupTypeEnum } from '../grid';
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

  private draggedNode: GridNode;

  private defaultVariableColor = "blue";
  private subGroupBackgroundColors = ["yellow", "red", "green", "pink", "grey"];
  private backgroundColorIndex = 0;

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
    // CENTER OF CLICK CALISS
    const x = event.x - this.xCanvasOffset;
    const y = event.y - this.yCanvasOffset;
    const closestNode: GridNode = this.gridService.getClosestNode(this.grid, x, y);
    if (this.mouse.isDragging || !this.draggedNode ) {
      this.draggedNode = closestNode;
      this.drawVariable(closestNode.x, closestNode.y, "pink");
    } else {
      this.animateDrag(x, y, this.draggedNode.x, this.draggedNode.y);
    }
    this.mouse.handleMouseEvent(event);
  }

  onMouseMove(event: any): void {
    if (!this.mouse.isDragging) {
      return;
    }
    const x = event.x - this.xCanvasOffset;
    const y = event.y - this.yCanvasOffset + this.shapeSize/2;
    this.animateDrag(x, y, this.draggedNode.x, this.draggedNode.y);
  }

  animateDrag(x: number, y: number, x0: number, y0: number) {
    this.reprint();
    this.drawVariable(x0, y0, "green");
    this.drawVariable(x, y, "yellow");
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
      const eqNode: GridNode = {
        x: 0,
        y: 0,
        grid: {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          nodes: []
        },
        operator: GroupTypeEnum.eq,
      }
      this.drawOperator(eqNode);
    }

    grid.nodes.forEach((node) => {
      if (node.operator === GroupTypeEnum.var) {
        const x = node.grid.nodes[0].x;
        const y = node.grid.nodes[0].y;
        this.drawVariable(x, y, "blue");
      } else {
        this.drawOperator(node);
        this.drawEquationGrid(node.grid);
      }
    });
  }

  drawOperator(node: GridNode) {
    const numberOfElements = node.grid.nodes.length || 2;

    for (let i=1; i<numberOfElements; i++) {
      let operatorX: number, operatorY:number;
      if (this.gridService.horizontalTypesList.includes(node.operator)) {
        operatorX = (1 - i/numberOfElements)*node.grid.width + node.x;
        operatorY = node.grid.height/2 + node.y;
      } else {
        operatorX = node.grid.width/2 + node.x;
        operatorY = (1 - i/numberOfElements)*node.grid.height + node.y;
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

  drawVariable(x: number, y: number, color: string) {
    this.context.fillStyle = color || this.defaultVariableColor;
    this.context.fillRect(x - this.shapeSize/2, y - this.shapeSize/2, this.shapeSize, this.shapeSize);
  }
}
