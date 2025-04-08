import { Cell, Grid, PathfindingAlgorithm, Position } from '@/types/maze';

// Helper for getting valid neighbors for pathfinding
const getPathNeighbors = (grid: Grid, cell: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  for (const dir of directions) {
    const newRow = cell.row + dir.row;
    const newCol = cell.col + dir.col;
    
    if (
      newRow >= 0 && 
      newRow < grid.length && 
      newCol >= 0 && 
      newCol < grid[0].length && 
      grid[newRow][newCol].type !== 'wall' && 
      !grid[newRow][newCol].visited
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  
  return neighbors;
};

// Find the start and end cells in the grid
const findStartAndEnd = (grid: Grid): { start: Cell; end: Cell } => {
  let start: Cell | null = null;
  let end: Cell | null = null;
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col].type === 'start') {
        start = grid[row][col];
      } else if (grid[row][col].type === 'end') {
        end = grid[row][col];
      }
      
      if (start && end) break;
    }
    if (start && end) break;
  }
  
  if (!start || !end) {
    throw new Error('Start or end point not found in the grid');
  }
  
  return { start, end };
};

// Reconstruct the path from end to start using the parent references
const reconstructPath = (endCell: Cell): Cell[] => {
  const path: Cell[] = [];
  let current: Cell | undefined = endCell;
  
  while (current && current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  
  if (current) {
    path.unshift(current); // Add the start node
  }
  
  return path;
};

// Calculate Manhattan distance between two cells (for A* heuristic)
const manhattanDistance = (a: Cell, b: Cell): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

// Helper for A* algorithm - find the lowest fScore in the open set
const findLowestFScore = (openSet: Cell[]): Cell => {
  let lowest = openSet[0];
  
  for (let i = 1; i < openSet.length; i++) {
    if ((openSet[i].fScore || Infinity) < (lowest.fScore || Infinity)) {
      lowest = openSet[i];
    }
  }
  
  return lowest;
};

// Reset pathfinding data in the grid
export const resetPathfindingData = (grid: Grid): Grid => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as Grid;
  
  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      const cell = newGrid[row][col];
      
      // Reset visited status
      cell.visited = false;
      
      // Reset distance
      cell.distance = Infinity;
      
      // Reset parent
      cell.parent = undefined;
      
      // Reset A* scores
      cell.fScore = Infinity;
      cell.gScore = Infinity;
      
      // Reset cell type if it's a visited or solution path
      if (cell.type === 'visited' || cell.type === 'path-solution') {
        cell.type = 'path';
      }
      // Preserve start and end points
      else if (cell.type === 'start' || cell.type === 'end') {
        // Keep these types as they are
      }
    }
  }
  
  return newGrid;
};

/**
 * Dijkstra's Algorithm
 */
export const dijkstra = (grid: Grid): { path: Cell[], visitedInOrder: Cell[] } => {
  const newGrid = resetPathfindingData(JSON.parse(JSON.stringify(grid)));
  const { start, end } = findStartAndEnd(newGrid);
  const visitedInOrder: Cell[] = [];
  
  // Set the start node's distance to 0
  start.distance = 0;
  
  // Create a priority queue (simulated with an array)
  const unvisitedNodes = newGrid.flat();
  
  while (unvisitedNodes.length > 0) {
    // Sort by distance
    unvisitedNodes.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    
    // Get the node with the smallest distance
    const closest = unvisitedNodes.shift();
    
    if (!closest) break;
    
    // If we encounter a wall, skip it
    if (closest.type === 'wall') continue;
    
    // If the closest node has distance of Infinity, we're trapped
    if (closest.distance === Infinity) return { path: [], visitedInOrder };
    
    // Mark the node as visited
    closest.visited = true;
    if (closest.type !== 'start' && closest.type !== 'end') {
      closest.type = 'visited';
    }
    visitedInOrder.push(closest);
    
    // If we've reached the end, reconstruct and return the path
    if (closest.row === end.row && closest.col === end.col) {
      return { path: reconstructPath(end), visitedInOrder };
    }
    
    // Update all neighbors
    const neighbors = getPathNeighbors(newGrid, closest);
    for (const neighbor of neighbors) {
      const distance = (closest.distance || 0) + 1;
      if (distance < (neighbor.distance || Infinity)) {
        neighbor.distance = distance;
        neighbor.parent = closest;
      }
    }
  }
  
  // No path found
  return { path: [], visitedInOrder };
};

/**
 * A* Algorithm
 */
export const aStar = (grid: Grid): { path: Cell[], visitedInOrder: Cell[] } => {
  const newGrid = resetPathfindingData(JSON.parse(JSON.stringify(grid)));
  const { start, end } = findStartAndEnd(newGrid);
  const visitedInOrder: Cell[] = [];
  
  // Initialize start node
  start.gScore = 0;
  start.fScore = manhattanDistance(start, end);
  
  // Open set contains nodes to be evaluated
  const openSet: Cell[] = [start];
  
  while (openSet.length > 0) {
    // Get the node with the lowest fScore
    const current = findLowestFScore(openSet);
    
    // Remove current from openSet
    openSet.splice(openSet.indexOf(current), 1);
    
    // Mark as visited
    current.visited = true;
    if (current.type !== 'start' && current.type !== 'end') {
      current.type = 'visited';
    }
    visitedInOrder.push(current);
    
    // If we've reached the end, reconstruct and return the path
    if (current.row === end.row && current.col === end.col) {
      return { path: reconstructPath(end), visitedInOrder };
    }
    
    // Check all neighbors
    const neighbors = getPathNeighbors(newGrid, current);
    for (const neighbor of neighbors) {
      // Tentative gScore
      const tentativeGScore = (current.gScore || 0) + 1;
      
      if (tentativeGScore < (neighbor.gScore || Infinity)) {
        // This path is better, record it
        neighbor.parent = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = neighbor.gScore + manhattanDistance(neighbor, end);
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  
  // No path found
  return { path: [], visitedInOrder };
};

/**
 * Breadth-First Search (BFS)
 */
export const breadthFirstSearch = (grid: Grid): { path: Cell[], visitedInOrder: Cell[] } => {
  const newGrid = resetPathfindingData(JSON.parse(JSON.stringify(grid)));
  const { start, end } = findStartAndEnd(newGrid);
  const visitedInOrder: Cell[] = [];
  
  // Queue for BFS
  const queue: Cell[] = [start];
  start.visited = true;
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (!current) break;
    
    if (current.type !== 'start' && current.type !== 'end') {
      current.type = 'visited';
    }
    visitedInOrder.push(current);
    
    // If we've reached the end, reconstruct and return the path
    if (current.row === end.row && current.col === end.col) {
      return { path: reconstructPath(end), visitedInOrder };
    }
    
    // Explore neighbors
    const neighbors = getPathNeighbors(newGrid, current);
    for (const neighbor of neighbors) {
      neighbor.visited = true;
      neighbor.parent = current;
      queue.push(neighbor);
    }
  }
  
  // No path found
  return { path: [], visitedInOrder };
};

/**
 * Depth-First Search (DFS)
 */
export const depthFirstSearch = (grid: Grid): { path: Cell[], visitedInOrder: Cell[] } => {
  const newGrid = resetPathfindingData(JSON.parse(JSON.stringify(grid)));
  const { start, end } = findStartAndEnd(newGrid);
  const visitedInOrder: Cell[] = [];
  
  // Stack for DFS
  const stack: Cell[] = [start];
  start.visited = true;
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (!current) break;
    
    if (current.type !== 'start' && current.type !== 'end') {
      current.type = 'visited';
    }
    visitedInOrder.push(current);
    
    // If we've reached the end, reconstruct and return the path
    if (current.row === end.row && current.col === end.col) {
      return { path: reconstructPath(end), visitedInOrder };
    }
    
    // Explore neighbors
    const neighbors = getPathNeighbors(newGrid, current);
    for (const neighbor of neighbors) {
      neighbor.visited = true;
      neighbor.parent = current;
      stack.push(neighbor);
    }
  }
  
  // No path found
  return { path: [], visitedInOrder };
};

/**
 * Find path using the selected algorithm
 */
export const findPath = (
  grid: Grid,
  algorithm: PathfindingAlgorithm
): { path: Cell[], visitedInOrder: Cell[] } => {
  switch (algorithm) {
    case PathfindingAlgorithm.DIJKSTRA:
      return dijkstra(grid);
    case PathfindingAlgorithm.ASTAR:
      return aStar(grid);
    case PathfindingAlgorithm.BFS:
      return breadthFirstSearch(grid);
    case PathfindingAlgorithm.DFS:
      return depthFirstSearch(grid);
    default:
      // Default to A* algorithm
      return aStar(grid);
  }
}; 