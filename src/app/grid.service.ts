import { Injectable } from '@angular/core';
import { Grid, GridNode } from './grid';

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
  nodeArray: GridNode[];


  constructor() {}

  // TODO: Pass arguments for width, height, x and y
  generateGrid() {
    this.grid = {
      width: 200,
      height: 100,
      xCenter: 200,
      yCenter: 250,
      nodes: [
        {x: 150, y: 200},
        {x: 250, y: 200},
        {
          x: 150,
          y: 300,
          grid: {
            width: 10,
            height: 10,
            xCenter: 10,
            yCenter: 10,
            nodes: [
              {x: 10, y: 10},
              {x: 11, y: 21},
              {x: 12, y: 22},
            ]
          },
        },
        {x: 250, y: 300},
      ],
    };

    this.nodeArray = this.flattenGrid(this.grid);
  }

  // TODO: Make all coordinates absolute (x + xCenter, etc, etc)
  flattenGrid(grid: Grid) : GridNode[] {
    let flatGrid: GridNode[] = [];
    grid.nodes.forEach( (node) => {
      if (!node.grid) {
        flatGrid.push(node);
      } else {
        flatGrid = flatGrid.concat(this.flattenGrid(node.grid));
      }
    });

    return flatGrid.flat();
  }

  getClosestNode(coord: {x: number, y: number}) : GridNode {
    this.grid = this.computeDistanceToNodes(coord, this.grid);
    const nodeArray = this.flattenGrid(this.grid);

    const min = Math.min(...nodeArray.map(n => n.dist));

    return nodeArray.filter(n => n.dist === min)[0];
  }

  computeDistanceToNodes(coord: {x:number, y:number}, grid?: Grid) {
    const _grid = grid || this.grid;

    _grid.nodes.map((n: GridNode) => {
      n.dist = Math.sqrt((n.x - coord.x)**2 + (n.y - coord.y)**2)
      // If node is a grid node, calculate distance recursively
      if (n.grid) {
        n.grid = this.computeDistanceToNodes(coord, n.grid);
      }
    });

    return _grid;
  }
}
