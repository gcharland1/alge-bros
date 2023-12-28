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

    let _grid: Grid = {width: width, height: height, x: x, y: y, nodes: []};
    if (!eq) { return _grid; }

    let i = 0;
    let innerX = x;
    let innerY = y;
    if (eq.grType === GroupTypeEnum.var) {
      _grid.nodes.push({
        x: x + width / 2,
        y: y + height / 2,
        operator: eq.grType,
      });
    } else {
      const nParts: number = eq.content.length;
      let innerWidth: number, innerHeight: number;

      if (this.horizontalTypesList.includes(eq.grType)) {
        innerWidth = _grid.width / nParts;
        innerHeight = _grid.height;
      } else {
        innerWidth= _grid.width;
        innerHeight= _grid.height / nParts;
      }

      eq.content.forEach(function (subEq: EqGroup) {
        _grid.nodes.push({
          x: innerX,
          y: innerY,
          operator: subEq.grType,
          grid: self.convertEquationToGrid(subEq, innerWidth, innerHeight, innerX, innerY)
        });

        // Does the group goes down horizontally or vertically? (Divisions are vertical, mult horizontal)
        if (self.horizontalTypesList.includes(eq.grType)) {
          innerX += innerWidth;
        } else {
          innerY += innerHeight;
        }
        i++;
      })
    }

    return _grid;
  }
}
