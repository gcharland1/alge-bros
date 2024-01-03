import { Grid, GroupTypeEnum } from './grid';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlgebraService {

  constructor() { }

  isMoveableVariable(variable: Grid, completeGrid: Grid) : Boolean {
    const parentGroup = this.findParentGroup(variable, completeGrid);
    if (parentGroup.operator === GroupTypeEnum.eq) {
      return true;
    } else {
      const grandParentGroup = this.findParentGroup(parentGroup, completeGrid);
      if (grandParentGroup.operator === GroupTypeEnum.eq) {
        return true;
      }
    }
    return false;
  }

  findParentGroup(variable: Grid, completeGrid: Grid) : Grid | undefined {
    let foundParent: Grid;
    completeGrid.nodes.forEach((subNode) => {
      if (subNode === variable) {
        foundParent = completeGrid;
      } else if (subNode.operator !== GroupTypeEnum.var) {
        foundParent = this.findParentGroup(variable, subNode) || foundParent;
      }
    });
    return foundParent;
  }
}
