import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GridNode, Grid, EqGroup, GroupTypeEnum } from '../grid';
import { GridService } from '../grid.service';

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

  private defaultVariableColor = "blue";
  private subGroupBackgroundColors = ["yellow", "red", "green", "pink", "grey"];
  private backgroundColorIndex = 0;

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

  reprint() {
    this.context.fillStyle = "grey";
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawEquationGrid(this.grid, true);
  }

  runGame() {
    this.reprint();
  }

  drawEquationGrid(grid: Grid, drawEqualSign?: boolean | undefined) {
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
      if (node.grid) {
        this.drawOperator(node);
        this.drawEquationGrid(node.grid);
      } else {
        this.drawVariable(node.x, node.y, "blue");
      }
    });
  }

  drawOperator(node: GridNode) {
    this.context.fillStyle = "black";
    this.context.font = "48px mono";
    const operatorSize = 30;
    const lineWidth = 5;

    const operatorX = node.grid.width/2 + node.x;
    const operatorY = node.grid.height/2 + node.y;

    switch (node.operator) {
      case GroupTypeEnum.add:
        this.context.fillText("+", operatorX - operatorSize/2, operatorY + operatorSize/2, operatorSize);
        break;
      case GroupTypeEnum.div:
        const diviserWidth = node.grid.width * 0.5;
        this.context.fillRect(operatorX - diviserWidth/2, operatorY, diviserWidth, lineWidth);
        break;
      case GroupTypeEnum.mul:
        this.context.fillText("x", operatorX - operatorSize/2, operatorY + operatorSize/2, operatorSize);
        break;
      case GroupTypeEnum.eq:
        this.context.fillText("=", operatorX - operatorSize/2, operatorY + operatorSize/2);
    }
  }

  /**
   * @param {number} x The center of the variable
   * @param {number} y The center of the variable
   */
  drawVariable(x: number, y: number, color: string) {
    x = x - (this.shapeSize / 2);
    y = y - (this.shapeSize / 2);

    this.context.fillStyle = color || this.defaultVariableColor;
    this.context.fillRect(x, y, this.shapeSize, this.shapeSize);
  }
}
