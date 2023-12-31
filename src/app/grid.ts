export interface EqGroup {
  grType: GroupTypeEnum,
  content: any[],
}

export enum GroupTypeEnum {
  eq = "eq",
  var = "var",
  add = "add",
  sub = "sub",
  mul = "mult",
  div = "div",
}

export interface GridNode {
  x: number,
  y: number,
  dist?: number,
  grid?: Grid,
  operator?: GroupTypeEnum,
}

export interface Grid {
  width: number,
  height: number,
  x: number,
  y: number,
  nodes: GridNode[],
}
