import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Cell from './Cell';
import { Grid as GridType } from '@/types/maze';

interface GridProps {
  grid: GridType;
  cellSize: number;
  wallThickness: number;
}

const GridWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    z-index: -1;
  }
`;

const GridContainer = styled(motion.div)<{ columns: number; cellSize: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, ${(props) => props.cellSize}px);
  gap: 0px;
  border-radius: ${props => props.theme.shape.borderRadius};
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: ${props => props.theme.shadows[1]};
  }
`;

const GridComponent: React.FC<GridProps> = ({ grid, cellSize, wallThickness }) => {
  return (
    <GridWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <GridContainer
        columns={grid[0].length}
        cellSize={cellSize}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              cell={cell}
              cellSize={cellSize}
              wallThickness={wallThickness}
            />
          ))
        )}
      </GridContainer>
    </GridWrapper>
  );
};

export default GridComponent; 