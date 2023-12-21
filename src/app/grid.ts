import { sha1 } from "@angular/compiler/src/i18n/digest";

export interface GridNode {
  x: number,
  y: number,
  dist?: number,
  grid?: Grid,
}

export interface Grid {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number,
  nodes: GridNode[],
}

export enum NodeType {
  position,
  grid,
}
