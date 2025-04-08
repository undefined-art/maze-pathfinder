import { Cell, Grid, MazeAlgorithm, Position } from '@/types/maze';

/**
 * Initialize a grid of walls
 */
export const initializeGrid = (rows: number, cols: number): Grid => {
  const grid: Grid = [];
  
  for (let row = 0; row < rows; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        type: 'wall',
        visited: false,
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
};

/**
 * Set start and end points on the grid
 */
export const setStartAndEnd = (grid: Grid): Grid => {
  const newGrid = [...grid];
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  
  // Set start in the top-left area
  let startRow = 1;
  let startCol = 1;
  
  // Make sure start point is a path
  if (newGrid[startRow][startCol].type === 'wall') {
    newGrid[startRow][startCol].type = 'path';
  }
  newGrid[startRow][startCol].type = 'start';
  
  // Set end in the bottom-right area
  let endRow = rows - 2;
  let endCol = cols - 2;
  
  // Make sure end point is a path
  if (newGrid[endRow][endCol].type === 'wall') {
    newGrid[endRow][endCol].type = 'path';
  }
  newGrid[endRow][endCol].type = 'end';
  
  return newGrid;
};

/**
 * Get random element from array
 */
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Check if position is within grid bounds
 */
const isInBounds = (grid: Grid, row: number, col: number): boolean => {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

/**
 * Get available neighbors for recursive backtracking
 */
const getNeighbors = (grid: Grid, row: number, col: number, distance: number = 2): Position[] => {
  const neighbors: Position[] = [];
  const directions = [
    { row: -distance, col: 0 }, // up
    { row: distance, col: 0 },  // down
    { row: 0, col: -distance }, // left
    { row: 0, col: distance }   // right
  ];
  
  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    
    if (isInBounds(grid, newRow, newCol) && grid[newRow][newCol].type === 'wall') {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

/**
 * Generate maze using recursive backtracking algorithm
 */
export const generateMazeRecursiveBacktracking = (grid: Grid): { grid: Grid, steps: Cell[][] } => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as Grid;
  const steps: Cell[][] = [];
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  
  // Start from a random position (must be odd to ensure walls between paths)
  const startRow = 1;
  const startCol = 1;
  
  newGrid[startRow][startCol].type = 'path';
  newGrid[startRow][startCol].visited = true;
  
  const stack: Position[] = [{ row: startRow, col: startCol }];
  steps.push(JSON.parse(JSON.stringify(newGrid.flat()))); // Save initial step
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getNeighbors(newGrid, current.row, current.col);
    
    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }
    
    const next = getRandomElement(neighbors);
    
    // Carve a path by setting the cell between current and next to a path
    const midRow = Math.floor((current.row + next.row) / 2);
    const midCol = Math.floor((current.col + next.col) / 2);
    
    newGrid[midRow][midCol].type = 'path';
    newGrid[next.row][next.col].type = 'path';
    newGrid[next.row][next.col].visited = true;
    
    stack.push(next);
    
    // Save this step for animation
    steps.push(JSON.parse(JSON.stringify(newGrid.flat())));
  }
  
  return { grid: newGrid, steps };
};

/**
 * Generate maze using Prim's algorithm
 */
export const generateMazePrims = (grid: Grid): { grid: Grid, steps: Cell[][] } => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as Grid;
  const steps: Cell[][] = [];
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  
  // Start from a random position (must be odd to ensure walls between paths)
  const startRow = 1;
  const startCol = 1;
  
  newGrid[startRow][startCol].type = 'path';
  
  // Frontier cells are wall cells that are adjacent to path cells
  const frontierCells: Position[] = [];
  
  // Add neighbors of the start cell to the frontier
  const directions = [
    { row: -2, col: 0 }, // up
    { row: 2, col: 0 },  // down
    { row: 0, col: -2 }, // left
    { row: 0, col: 2 }   // right
  ];
  
  for (const dir of directions) {
    const newRow = startRow + dir.row;
    const newCol = startCol + dir.col;
    
    if (isInBounds(newGrid, newRow, newCol) && newGrid[newRow][newCol].type === 'wall') {
      frontierCells.push({ row: newRow, col: newCol });
    }
  }
  
  steps.push(JSON.parse(JSON.stringify(newGrid.flat()))); // Save initial step
  
  while (frontierCells.length > 0) {
    // Choose a random frontier cell
    const randomIndex = Math.floor(Math.random() * frontierCells.length);
    const current = frontierCells[randomIndex];
    
    // Remove the current frontier cell from the list
    frontierCells.splice(randomIndex, 1);
    
    // Find neighboring path cells
    const pathNeighbors: Position[] = [];
    
    for (const dir of directions) {
      const neighborRow = current.row + dir.row;
      const neighborCol = current.col + dir.col;
      
      if (isInBounds(newGrid, neighborRow, neighborCol) && 
          newGrid[neighborRow][neighborCol].type === 'path') {
        pathNeighbors.push({ row: neighborRow, col: neighborCol });
      }
    }
    
    if (pathNeighbors.length > 0) {
      // Choose a random path neighbor
      const randomNeighbor = getRandomElement(pathNeighbors);
      
      // Connect the frontier cell to the path by removing the wall in between
      const midRow = Math.floor((current.row + randomNeighbor.row) / 2);
      const midCol = Math.floor((current.col + randomNeighbor.col) / 2);
      
      newGrid[midRow][midCol].type = 'path';
      newGrid[current.row][current.col].type = 'path';
      
      // Save this step for animation
      steps.push(JSON.parse(JSON.stringify(newGrid.flat())));
      
      // Add new frontier cells
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        
        if (isInBounds(newGrid, newRow, newCol) && newGrid[newRow][newCol].type === 'wall') {
          frontierCells.push({ row: newRow, col: newCol });
        }
      }
    }
  }
  
  return { grid: newGrid, steps };
};

/**
 * Generate a random maze (simple approach with random wall placement)
 */
export const generateRandomMaze = (grid: Grid): { grid: Grid, steps: Cell[][] } => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as Grid;
  const steps: Cell[][] = [];
  const rows = newGrid.length;
  const cols = newGrid[0].length;
  
  // Set all cells to path initially
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      newGrid[row][col].type = 'path';
    }
  }
  
  // Add random walls (approximately 30% of cells)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Keep borders as walls
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        newGrid[row][col].type = 'wall';
      } 
      // Randomly make some cells walls
      else if (Math.random() < 0.3) {
        newGrid[row][col].type = 'wall';
      }
    }
  }
  
  steps.push(JSON.parse(JSON.stringify(newGrid.flat())));
  
  return { grid: newGrid, steps };
};

/**
 * Generate maze based on selected algorithm
 */
export const generateMaze = (
  rows: number, 
  cols: number, 
  algorithm: MazeAlgorithm
): { grid: Grid, steps: Cell[][] } => {
  // Initialize grid with all walls
  let grid = initializeGrid(rows, cols);
  let result;
  
  switch (algorithm) {
    case MazeAlgorithm.RECURSIVE_BACKTRACKING:
      result = generateMazeRecursiveBacktracking(grid);
      break;
    case MazeAlgorithm.PRIMS:
      result = generateMazePrims(grid);
      break;
    case MazeAlgorithm.RANDOM:
      result = generateRandomMaze(grid);
      break;
    default:
      // Default to recursive backtracking
      result = generateMazeRecursiveBacktracking(grid);
  }
  
  // Set start and end points
  result.grid = setStartAndEnd(result.grid);
  
  return result;
}; 