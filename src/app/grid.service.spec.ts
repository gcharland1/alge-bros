import { TestBed } from '@angular/core/testing';
import { GridNode, Grid } from './grid';

import { GridService } from './grid.service';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridService);
    service.grid = generateNodeGrid();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should flatten Grid', () => {
    const expectedFlattenGrid : GridNode[] = [
        {x: 150, y: 200},
        {x: 250, y: 200},
        {x: 10, y: 10},
        {x: 11, y: 21},
        {x: 12, y: 22},
        {x: 250, y: 300},
    ];

    const actualFlattenGrid = service.flattenGrid(service.grid);

    expect(actualFlattenGrid).toEqual(expectedFlattenGrid);
  });

  it('Should compute node distance to coordinates', () => {
      const grid: Grid = {
        xCenter: 0,
        yCenter: 0,
        height: 0,
        width: 0,
        nodes: [{x:10, y:10}]
      };

      const expectedGrid: Grid = {
        xCenter: 0,
        yCenter: 0,
        height: 0,
        width: 0,
        nodes: [{x:10, y:10, dist: 5}]
      }

      const actualGrid: Grid = service.computeDistanceToNodes({x: 13, y: 14}, grid);

      expect(actualGrid).toEqual(expectedGrid);
  });

  it('Should return closest node', () => {
      const expectedClosestNode = {x: 10, y: 10, dist: 5};

      const actualClosestNode = service.getClosestNode({x: 7, y: 6});

      expect(service.computeDistanceToNodes).toHaveBeenCalled;
      expect(actualClosestNode).toEqual(expectedClosestNode);
  });
});

function generateNodeGrid(): Grid {
  return {
      width: 200,
      height: 100,
      xCenter: 200,
      yCenter: 250,
      nodes: [
        {x: 150, y: 200},
        {x: 250, y: 200},
        {
          x: 150,
          y: 300,
          grid: {
            width: 10,
            height: 10,
            xCenter: 10,
            yCenter: 10,
            nodes: [
              {x: 10, y: 10},
              {x: 11, y: 21},
              {x: 12, y: 22},
            ]
          },
        },
        {x: 250, y: 300},
      ],
    }
};
