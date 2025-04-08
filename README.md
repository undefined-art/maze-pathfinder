# Maze Pathfinder

A web-based visualization tool for maze generation and pathfinding algorithms, built with React, Next.js, TypeScript, and Framer Motion.

## Features

- **Maze Generation Algorithms**:

  - Recursive Backtracking
  - Prim's Algorithm
  - Random Maze Generation

- **Pathfinding Algorithms**:

  - A\* Search
  - Dijkstra's Algorithm
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)

- **Interactive Visualizations**:

  - Real-time maze generation animations
  - Step-by-step pathfinding visualization
  - Colorful UI with intuitive controls

- **Customization**:
  - Adjustable animation speed
  - Clear path while preserving the maze
  - Complete grid reset

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/maze-pathfinder.git
   cd maze-pathfinder
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

1. Select a maze generation algorithm from the dropdown.
2. Click "Generate Maze" to create a new maze.
3. Choose a pathfinding algorithm.
4. Click "Find Path" to visualize the pathfinding process.
5. Use the animation speed slider to adjust visualization speed.
6. Click "Clear Path" to remove the current path while keeping the maze.
7. Click "Reset" to clear everything and start over.

## The Magic Behind the Algorithms

### Maze Generation

- **Recursive Backtracking**: Creates a perfect maze by carving paths using depth-first search with backtracking.
- **Prim's Algorithm**: Builds a minimum spanning tree, starting with a cell and growing outward by randomly selecting walls.
- **Random Maze**: Creates a maze with random wall placement for a varied challenge.

### Pathfinding

- **A\* Search**: Combines Dijkstra's approach with heuristics to efficiently find the shortest path.
- **Dijkstra's Algorithm**: Explores paths methodically by prioritizing the shortest cumulative distance.
- **BFS**: Explores all neighboring cells layer by layer, guaranteeing the shortest path in unweighted mazes.
- **DFS**: Dives deep along each possible path before backtracking, creating an interesting exploration pattern.

## Tech Stack

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
