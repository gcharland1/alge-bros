import { Grid, GroupTypeEnum} from './grid';

export class GridService {
  equation: Grid;
  grid: Grid;
  horizontalTypesList = ["add", "sus", "mult", "eq"];

  constructor() {}

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

    // Switch case dans les autres cas ?
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
