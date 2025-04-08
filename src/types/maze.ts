export type CellType = 'wall' | 'path' | 'start' | 'end' | 'visited' | 'path-solution';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  visited?: boolean;
  distance?: number;
  parent?: Cell;
  fScore?: number; 
  gScore?: number; 
}

export interface Position {
  row: number;
  col: number;
}

export type Grid = Cell[][];

export interface MazeConfig {
  rows: number;
  cols: number;
  cellSize: number;
  wallThickness: number;
  animationSpeed: number;
}

export enum MazeAlgorithm {
  RECURSIVE_BACKTRACKING = 'Recursive Backtracking',
  PRIMS = 'Prim\'s Algorithm',
  KRUSKALS = 'Kruskal\'s Algorithm',
  RANDOM = 'Random Maze'
}

export enum PathfindingAlgorithm {
  DIJKSTRA = 'Dijkstra\'s Algorithm',
  ASTAR = 'A* Algorithm',
  BFS = 'Breadth-First Search',
  DFS = 'Depth-First Search'
} 