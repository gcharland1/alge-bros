import { Injectable } from '@angular/core';
import { Grid, GroupTypeEnum} from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {
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

  getDistanceToNode(node: Grid, x: number, y: number): number {
    return (node.x - x)**2 + (node.y - y)**2;
  }

  scaleGrid(grid: Grid, width: number, height: number): Grid {
    if (grid.operator === GroupTypeEnum.var || !grid.nodes) {
      return {...grid,
        width,
        height,
      }
    }

    const isHorizontal = this.horizontalTypesList.includes(grid.operator);
    let nParts = grid.nodes.length;
    const innerWidth = isHorizontal ? width/nParts : width;
    const innerHeight = isHorizontal ? height : height/nParts;

    // EN HAUT À GAUCHE
    for (let i=0; i<nParts; i++) {
      console.log({i, innerHeight, innerWidth});
      grid.nodes[i] = {...this.scaleGrid(grid.nodes[i], innerWidth, innerHeight),
        x: isHorizontal ? i*innerWidth : 0,
        y: isHorizontal ? 0 : i*innerHeight,
      };
    }

    return {...grid,
      width,
      height,
      x: 0,
      y: 0,
    };
  }

  /**
    * Parses math equation to @Grid object
  */
  parseEquation(equation: string, priorityLevel: GroupTypeEnum): Grid {
    // Early return for variables
    // TODO: Check is is a multiplication like 2x
    if (equation.length === 1 || priorityLevel === GroupTypeEnum.var) {
      return {
        equation,
        operator: GroupTypeEnum.var,
      };
    }

    let _gr: Grid = {
      equation,
      operator: priorityLevel,
      nodes: [],
    };

    switch (priorityLevel) {
      case GroupTypeEnum.eq:
        equation = equation.split(' ').join('');
        equation.split('=').forEach((eqPart) => {
          if (eqPart.includes('+')) {
            _gr.nodes.push(this.parseEquation(eqPart, GroupTypeEnum.add));
          } else if (eqPart.includes('-')) {
            _gr.nodes.push(this.parseEquation(eqPart, GroupTypeEnum.sub));
          } else if (eqPart.includes('*')) {
            _gr.nodes.push(this.parseEquation(eqPart, GroupTypeEnum.mul));
          } else if (eqPart.includes('/')) {
            _gr.nodes.push(this.parseEquation(eqPart, GroupTypeEnum.div));
          } else {
            _gr.nodes.push(this.parseEquation(eqPart, GroupTypeEnum.var));
          }
        });
        break;

      case GroupTypeEnum.add:
      case GroupTypeEnum.sub:
        this.splitEquationIntoComponents(equation, priorityLevel).forEach((_) => {
          if (_.includes('/')) {
            _gr.nodes.push(this.parseEquation(_, GroupTypeEnum.div));
          } else if (_.includes('*')) {
            _gr.nodes.push(this.parseEquation(_, GroupTypeEnum.mul));
          } else {
            _gr.nodes.push(this.parseEquation(_, GroupTypeEnum.var));
          }
        });
        break;

      case GroupTypeEnum.mul:
      case GroupTypeEnum.div:
        this.splitEquationIntoComponents(equation, priorityLevel).forEach((_) => {
          _gr.nodes.push(this.parseEquation(_, GroupTypeEnum.var));
        });
        break;
    }

    return _gr;
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

}
