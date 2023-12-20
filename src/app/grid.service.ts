import { Injectable } from '@angular/core';
import { GridNode } from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  r: number = 2;
  c: number = 3;
  width: number = 300;
  height: number = 300;
  n: number = 0;
  grid: GridNode[];


  constructor() {}

  generateGrid() {
    this.grid = [
      {x: 125, y: 100},
      {x: 250, y: 100},
      {x: 125, y: 200},
      {x: 250, y: 200},
      {x: 125, y: 300},
      {x: 250, y: 300}
    ];
  }

  getClosestNode(coordinates: {x: number, y: number}) : GridNode {
    this.getDistanceToNode(coordinates);
    const min = Math.min(...this.grid.map(n => n.dist));
    const closestNode = this.grid.filter(n => n.dist === min)[0];

    return closestNode;
  }

  getDistanceToNode(coordinates: {x:number, y:number}) {
    this.grid.map((n: GridNode) => {
      n.dist = Math.sqrt((n.x - coordinates.x)**2 + (n.y - coordinates.y)**2)
    });
  }

}
