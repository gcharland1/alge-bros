import { Injectable } from '@angular/core';
import { Grid, EqGroup, GroupTypeEnum} from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  equation: EqGroup;
  grid: Grid;
  horizontalTypesList = ["add", "sus", "mult", "eq"];

  constructor() {}

  getClosestNode(grid: Grid, x: number, y: number): Grid {
    const self = this
    let closestNode: Grid;

    grid.nodes.forEach((node) => {
      if (node.operator === GroupTypeEnum.var) {
        if (!closestNode) {
          closestNode = node;
        } else if (this.getDistanceToNode(node, x, y) < this.getDistanceToNode(closestNode, x, y)) {
          closestNode = node;
        }
      } else {
        const childClosestNode = self.getClosestNode(node, x, y);
        if (!closestNode || this.getDistanceToNode(childClosestNode, x, y) < this.getDistanceToNode(closestNode, x, y)) {
          closestNode = childClosestNode;
        }
      }
    });

    return closestNode
  }

  shrinkGridInHalf(grid: Grid, axis: number) : Grid {
    if (grid.operator === GroupTypeEnum.var) {
        return {...grid,
          x: grid.x - grid.width/4,
          width: grid.width/2,
          height: grid.height/2,
        }
    }
    for (let i=0; i<grid.nodes.length; i ++) {
      let node = {...grid.nodes[i] };
      grid.nodes[i] = { ...node,
          x: node.x - node.width/4,
          width: node.width/2,
          height: node.height/2,
        }
      }

      return { ...grid,
          x: grid.x - grid.width/4,
          width: grid.width/2,
          height: grid.height/2,
        };
  }


  getDistanceToNode(node: Grid, x: number, y: number): number {
    return (node.x - x)**2 + (node.y - y)**2;
  }

  /**
    * Parses math equation to @EqGroup object
  */
  parseEquation(equation: string, priorityLevel: GroupTypeEnum) {
    // Early return for variables
    // TODO: Check is is a multiplication like 2x
    if (equation.length === 1) {
      return {grType: GroupTypeEnum.var, content: [equation]};
    }

    let _eq: EqGroup = {
      grType: priorityLevel,
      content: [],
    };

    // Switch case dans les autres cas ?
    switch (priorityLevel) {
      case GroupTypeEnum.var:
        _eq.content.push(equation);
        break;
      case GroupTypeEnum.eq:
        equation = equation.split(' ').join('');
        equation.split('=').forEach((eqPart) => {
          if (eqPart.includes('+')) {
            _eq.content.push(this.parseEquation(eqPart, GroupTypeEnum.add));
          } else if (eqPart.includes('-')) {
            _eq.content.push(this.parseEquation(eqPart, GroupTypeEnum.sub));
          } else if (eqPart.includes('*')) {
            _eq.content.push(this.parseEquation(eqPart, GroupTypeEnum.mul));
          } else if (eqPart.includes('/')) {
            _eq.content.push(this.parseEquation(eqPart, GroupTypeEnum.div));
          } else {
            _eq.content.push(this.parseEquation(eqPart, GroupTypeEnum.var));
          }
        });
        break;

      case GroupTypeEnum.add:
      case GroupTypeEnum.sub:
        this.splitEquationIntoComponents(equation, priorityLevel).forEach((_) => {
          if (_.includes('/')) {
            _eq.content.push(this.parseEquation(_, GroupTypeEnum.div));
          } else if (_.includes('*')) {
            _eq.content.push(this.parseEquation(_, GroupTypeEnum.mul));
          } else {
            _eq.content.push(this.parseEquation(_, GroupTypeEnum.var));
          }
        });
        break;

      case GroupTypeEnum.mul:
      case GroupTypeEnum.div:
        this.splitEquationIntoComponents(equation, priorityLevel).forEach((_) => {
          _eq.content.push(this.parseEquation(_, GroupTypeEnum.var));
        });
        break;
    }

    return _eq;
  }

  splitEquationIntoComponents(equation: string, operator: GroupTypeEnum) : string[] {
    const operatorRegexp = {
      "add": /\+/,
      "sub": /\-/,
      "mult": /\*/,
      "div": /\//
    };

    return equation.split(operatorRegexp[operator]).filter(_ => _.length > 0);
  };

  /**
    * Define node positions according to equation complexity
  * Split self width and height equally between components
  * self equation
  */
  convertEquationToGrid(eq: EqGroup, width: number, height: number, x: number, y: number) : Grid {
    var self = this;

    if (eq.grType === GroupTypeEnum.var) {
      return {
        width,
        height,
        x: x + width/2,
        y: y + height/2,
        operator: GroupTypeEnum.var,
        isX: eq.content[0] === "x",
      }
    }

    let innerX = x;
    let innerY = y;
    const nParts: number = eq.content.length;
    let innerWidth: number, innerHeight: number;

    if (this.horizontalTypesList.includes(eq.grType)) {
      innerWidth = width / nParts;
      innerHeight = height;
    } else {
      innerWidth= width;
      innerHeight= height / nParts;
    }

    const _grid = {
      width,
      height,
      x,
      y,
      operator: eq.grType,
      nodes : []
    }
    eq.content.forEach(function (subEq: EqGroup) {
      _grid.nodes.push(self.convertEquationToGrid(subEq, innerWidth, innerHeight, innerX, innerY));

      // Does the group goes down horizontally or vertically? (Divisions are vertical, mult horizontal)
      if (self.horizontalTypesList.includes(eq.grType)) {
        innerX += innerWidth;
      } else {
        innerY += innerHeight;
      }
    })

    return _grid;
  }
}
