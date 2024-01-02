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

export interface Grid {
  width: number,
  height: number,
  x: number,
  y: number,
  nodes?: Grid[],
  operator?: GroupTypeEnum,
}
