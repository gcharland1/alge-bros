import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlgebraService {

  constructor() {}

  getMoveableBlocks(eq: string): string[] {
    return eq.split("+");
  }

  removeVariableFromEquation(variable: string, eq: string) {
    const moveableBlocks = this.getMoveableBlocks(eq);
    return moveableBlocks.filter((v) => v === variable);
  }

}
