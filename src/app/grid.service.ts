import { Injectable } from '@angular/core';
import { Grid, EqGroup, GroupTypeEnum} from './grid';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  equation: EqGroup;
  grid: Grid;

  constructor() {}

  /**
    * Parses math equation to @EqGroup object
  */
  parseEquation(equation: string | undefined) {
    console.log(equation.split(' ').join(''));
    let _eq: EqGroup = {
      grType: GroupTypeEnum.eq,
      content: [],
    };

    return {
      grType: GroupTypeEnum.eq,
      content: [
        {
          grType: GroupTypeEnum.div,
          content: [
            {grType: GroupTypeEnum.var, content: ["x"]},
            {grType: GroupTypeEnum.var, content: ["2"]},
          ],
        },
        {
          grType: GroupTypeEnum.add,
          content: [
            {grType: GroupTypeEnum.var, content: ["x"]},
            {grType: GroupTypeEnum.var, content: ["1"]},
          ]
        }
      ],
    };
  }

  /**
    * Define node positions according to equation complexity
  * Split self width and height equally between components
  * self equation
  */
  convertEquationToGrid(eq: EqGroup, width: number, height: number, x: number, y: number) : Grid {
    var self = this;
    const horizontalTypesList = ["add", "sus", "mult", "eq"];

    let _grid: Grid = {width: width, height: height, x: x, y: y, nodes: []};
    if (!eq) { return _grid; }

    let i = 0;
    let innerX = x;
    let innerY = y;
    if (eq.grType === GroupTypeEnum.var) {
      console.log("Adding variable");
      _grid.nodes.push({x: x + width / 2, y: y + height / 2});
    } else {
      const nParts: number = eq.content.length;
      let innerWidth, innerHeight;
      if (horizontalTypesList.includes(eq.grType)) {
        innerWidth = _grid.width / nParts;
        innerHeight = _grid.height;
      } else {
        innerWidth= _grid.width;
        innerHeight= _grid.height / nParts;
      }

      console.log("eq = ", eq);
      eq.content.forEach(function (subEq: EqGroup) {
        _grid.nodes.push({
          x: innerX,
          y: innerY,
          grid: self.convertEquationToGrid(subEq, innerWidth, innerHeight, innerX, innerY)
        });

        // Does the group goes down horizontally or vertically? (Divisions are vertical, mult horizontal)
        if (horizontalTypesList.includes(eq.grType)) {
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
