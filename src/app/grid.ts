export interface Grid {
  nodes: GridNode[]
}

export interface GridNode {
  x: number,
  y: number
  dist?: number;
}
