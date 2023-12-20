import { Injectable } from '@angular/core';
import { GridNode, Grid } from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  r: number = 2;
  c: number = 3;
  width: number = 300;
  height: number = 300;
  n: number = 0;
  grid: Grid;


  constructor() {}

  generateGrid() {
    this.grid = {nodes: [
      {x: 125, y: 100},
      {x: 250, y: 100},
      {x: 125, y: 200},
      {x: 250, y: 200},
      {x: 125, y: 300},
      {x: 250, y: 300}
    ]};
  }

  getClosestNode(coordinates: number[]) {
    const closestNode = this.grid.nodes[this.n];
    this.n = this.n + 1 < this.grid.nodes.length ? this.n + 1 : 0;
    console.log(this.grid, this.n);
    return closestNode;
  }
}
