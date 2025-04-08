import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Head from 'next/head';
import GridComponent from '@/components/Grid';
import ControlPanel from '@/components/ControlPanel';
import { 
  Cell, 
  Grid, 
  MazeAlgorithm, 
  PathfindingAlgorithm 
} from '@/types/maze';
import { 
  generateMaze, 
  initializeGrid, 
  setStartAndEnd 
} from '@/algorithms/mazeGenerator';
import { 
  findPath, 
  resetPathfindingData 
} from '@/algorithms/pathfinding';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled(motion.header)`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Description = styled.p`
  font-size: 18px;
  color: #7f8c8d;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ecf0f1;
  padding: 0 35px;
  border-radius: 8px;
  max-width: 900px;
  margin: 10px auto;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 5px;
`;

const StatValue = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
`;

const InfoContainer = styled(motion.div)`
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  max-width: 900px;
  margin: 10px auto;
`;

const InfoTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #34495e;
  line-height: 1.5;
`;

const ROWS = 25;
const COLS = 45;
const CELL_SIZE = 20;
const WALL_THICKNESS = 2;

const HomePage: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  
  const [mazeAlgorithm, setMazeAlgorithm] = useState<MazeAlgorithm>(MazeAlgorithm.RECURSIVE_BACKTRACKING);
  const [pathAlgorithm, setPathAlgorithm] = useState<PathfindingAlgorithm>(PathfindingAlgorithm.ASTAR);
  
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFindingPath, setIsFindingPath] = useState<boolean>(false);
  
  const [pathLength, setPathLength] = useState<number>(0);
  const [visitedNodes, setVisitedNodes] = useState<number>(0);
  const [generateTime, setGenerateTime] = useState<number>(0);
  const [solveTime, setSolveTime] = useState<number>(0);
  
  useEffect(() => {
    initializeMaze();
  }, []);
  
  const getAnimationDelay = (): number => {
    return 100 - animationSpeed; // 1 to 99 ms
  };
  
  const initializeMaze = () => {
    const emptyGrid = initializeGrid(ROWS, COLS);
    const gridWithStartEnd = setStartAndEnd(emptyGrid);
    setGrid(gridWithStartEnd);
    setPathLength(0);
    setVisitedNodes(0);
    setGenerateTime(0);
    setSolveTime(0);
  };
  
  const handleGenerateMaze = async () => {
    setIsGenerating(true);
    
    setPathLength(0);
    setVisitedNodes(0);
    setSolveTime(0);
    
    const startTime = performance.now();
    
    const { grid: newGrid, steps } = generateMaze(ROWS, COLS, mazeAlgorithm);
    
    const delay = getAnimationDelay();
    
    for (let i = 0; i < steps.length; i++) {
      const stepGrid: Grid = [];
      const flatStep = steps[i];
      
      for (let row = 0; row < ROWS; row++) {
        const currentRow: Cell[] = [];
        for (let col = 0; col < COLS; col++) {
          currentRow.push(flatStep[row * COLS + col]);
        }
        stepGrid.push(currentRow);
      }
      
      setGrid(stepGrid);
      
      if (i < steps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    
    const finalGrid = setStartAndEnd(newGrid);
    setGrid(finalGrid);
    
    const endTime = performance.now();
    setGenerateTime(endTime - startTime);
    
    setIsGenerating(false);
  };
  
  const handleFindPath = async () => {
    setIsFindingPath(true);

    const resetGrid = resetPathfindingData(grid);

    setGrid(resetGrid);

    const startTime = performance.now();
    const { path, visitedInOrder } = findPath(resetGrid, pathAlgorithm);
    const delay = getAnimationDelay();
    let currentGrid = JSON.parse(JSON.stringify(resetGrid)) as Grid;

    for (let i = 0; i < visitedInOrder.length; i++) {
      const node = visitedInOrder[i];
      
      if (currentGrid[node.row][node.col].type !== 'start' &&
          currentGrid[node.row][node.col].type !== 'end') {
        currentGrid[node.row][node.col].type = 'visited';
      }
      
      setGrid([...currentGrid]);
      
      if (i < visitedInOrder.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay / 2));
      }
    }
    

    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      
      if (currentGrid[node.row][node.col].type !== 'start' &&
          currentGrid[node.row][node.col].type !== 'end') {
        currentGrid[node.row][node.col].type = 'path-solution';
      }
      
      setGrid([...currentGrid]);
      
      if (i < path.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    
    const endTime = performance.now();
    
    setSolveTime(endTime - startTime);
    setPathLength(path.length);
    setVisitedNodes(visitedInOrder.length);
    setIsFindingPath(false);
  };
  
  const handleClearPath = () => {
    const clearedGrid = resetPathfindingData(grid);
    setGrid(clearedGrid);
    setPathLength(0);
    setVisitedNodes(0);
    setSolveTime(0);
  };
  
  const handleReset = () => {
    initializeMaze();
  };
  
  return (
    <>
      <Head>
        <title>Maze Pathfinder</title>
        <meta name="description" content="Visualizing maze generation and pathfinding algorithms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Maze Pathfinder</Title>
          <Description>
            Visualize maze generation and pathfinding algorithms in action
          </Description>
        </Header>
        
        <ControlPanel
          onGenerateMaze={handleGenerateMaze}
          onFindPath={handleFindPath}
          onReset={handleReset}
          onClearPath={handleClearPath}
          onMazeAlgorithmChange={setMazeAlgorithm}
          onPathfindingAlgorithmChange={setPathAlgorithm}
          onSpeedChange={setAnimationSpeed}
          selectedMazeAlgorithm={mazeAlgorithm}
          selectedPathfindingAlgorithm={pathAlgorithm}
          animationSpeed={animationSpeed}
          isGenerating={isGenerating}
          isFindingPath={isFindingPath}
        />
        
        <StatsContainer>
          <Stat>
            <StatLabel>Path Length</StatLabel>
            <StatValue>{pathLength}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Visited Nodes</StatLabel>
            <StatValue>{visitedNodes}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Generation Time</StatLabel>
            <StatValue>{generateTime.toFixed(2)} ms</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Solve Time</StatLabel>
            <StatValue>{solveTime.toFixed(2)} ms</StatValue>
          </Stat>
        </StatsContainer>
        
        {grid.length > 0 && (
          <GridComponent
            grid={grid}
            cellSize={CELL_SIZE}
            wallThickness={WALL_THICKNESS}
          />
        )}
        
        <InfoContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <InfoTitle>How It Works</InfoTitle>
          <InfoText>
            This application visualizes different algorithms for maze generation and pathfinding.
            First, select a maze generation algorithm and click "Generate Maze" to create a random maze.
            Then, select a pathfinding algorithm and click "Find Path" to visualize how the algorithm
            finds the shortest path from the start (green) to the end (red).
          </InfoText>
          <InfoText>
            The blue cells represent areas that the pathfinding algorithm has visited during its search,
            and the yellow cells represent the final path it found. You can adjust the animation speed
            using the slider above.
          </InfoText>
        </InfoContainer>
      </Container>
    </>
  );
};

export default HomePage; 