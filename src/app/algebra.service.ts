import { Grid, GroupTypeEnum } from './grid';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlgebraService {

  constructor() { }

  // TODO: ( Ajouter simplifiy(Grid) {} )

  swapVariabe(variable: Grid, completeGrid: Grid) : Grid {
    const parentGrid: Grid = this.findParentGroup(variable, completeGrid);
    const newParentIndex: number = completeGrid.nodes.length - completeGrid.nodes.indexOf(parentGrid) - 1;
    const newParentGrid: Grid = completeGrid.nodes[newParentIndex];
    console.log({newParentGrid, newParentIndex});

    let inverseOperator: GroupTypeEnum;
    switch (parentGrid.operator) {
      case GroupTypeEnum.add:
        inverseOperator = GroupTypeEnum.sub;
        break;
    }
    const newLHS: Grid = this.removeFromParent(variable, parentGrid);
    const newRHS: Grid = this.addToParent(variable, newParentGrid, inverseOperator);
    console.log({newLHS, newRHS});

    return {...completeGrid,
      nodes: [newLHS, newRHS]
    }
  }

  addToParent(variable: Grid, newParent: Grid, operator: GroupTypeEnum): Grid {
    if (newParent.nodes.length > 2) { return newParent};

    return {...newParent,
      operator: operator,
      nodes: [{...newParent,
        width: newParent.width/2,
      }, {...variable,
        width: newParent.width/2,
      }],
    };
  }

  removeFromParent(variable: Grid, parentGrid: Grid): Grid {
    if (parentGrid.nodes.length > 2) {
      console.log("x = y = z ???", parentGrid);
      return parentGrid;
    }

    for (let i = 0; i < parentGrid.nodes.length; i++) {
      if (parentGrid.nodes[i] !== variable) {
        return {...parentGrid.nodes[i]};
      }
    }
    return parentGrid;
  }

  getOtherSideOfEquation(variable:Grid, completeGrid: Grid, operator: GroupTypeEnum): Grid {
    let i_2: number;
    for (let i = 0; i < completeGrid.nodes.length; i++) {
      if (this.findParentGroup(variable, completeGrid.nodes[i])) {
        i_2 = completeGrid.nodes.length - i;
      }
    }

    const returnGrid: Grid = {...completeGrid,
      nodes: [completeGrid, variable],
      operator,
    }

    return returnGrid;
  }

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

  findParentGroup(variable: Grid, completeGrid: Grid) : Grid {
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
