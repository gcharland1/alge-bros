import { Injectable } from '@angular/core';
import { GridNode, Grid } from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() { }

  getClosestNode(grid: Grid, coordinates: number[]) {
    const closestNode = { x: 100, y: 200 };
    return closestNode;

  }
}
