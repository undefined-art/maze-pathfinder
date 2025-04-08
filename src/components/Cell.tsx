import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Cell as CellType } from '@/types/maze';

interface CellProps {
  cell: CellType;
  cellSize: number;
  wallThickness: number;
}

const getCellColor = (cellType: string, theme: any): string => {
  switch (cellType) {
    case 'wall':
      return theme.colors.background.dark;
    case 'path':
      return theme.colors.background.default;
    case 'start':
      return theme.colors.secondary.main;
    case 'end':
      return theme.colors.error.main;
    case 'visited':
      return theme.colors.primary.light;
    case 'path-solution':
      return '#FFD700';
    default:
      return theme.colors.background.default;
  }
};

const CellContainer = styled(motion.div)<{
  cellType: string;
  size: number;
}>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => getCellColor(props.cellType, props.theme)};
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  box-shadow: ${props => 
    props.cellType === 'path-solution' ? props.theme.shadows[1] : 'none'};
  position: relative;
  transition: background-color 0.3s ease;
  
  ${props => props.cellType === 'wall' && `
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.05);
      background-image: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.1) 25%,
        transparent 25%,
        transparent 50%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.1) 75%,
        transparent 75%,
        transparent
      );
      background-size: 8px 8px;
    }
  `}
  
  ${props => (props.cellType === 'start' || props.cellType === 'end') && `
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: ${props.cellType === 'start' ? '60%' : '55%'};
      height: ${props.cellType === 'start' ? '60%' : '55%'};
      border-radius: 50%;
      background-color: ${props.cellType === 'start' ? props.theme.colors.secondary.main : props.theme.colors.error.main};
      box-shadow: ${props.theme.shadows[2]};
      opacity: 0.95;
    }
  `}
  
  ${props => props.cellType === 'visited' && `
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: ${props.theme.colors.primary.dark};
      opacity: 0.7;
    }
  `}
  
  ${props => props.cellType === 'path-solution' && `
    &::after {
      content: '';
      position: absolute;
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      background-color: currentColor;
      opacity: 0.3;
      border-radius: 3px;
    }
  `}
`;

const Cell: React.FC<CellProps> = ({ cell, cellSize, wallThickness }) => {
  const cellVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0
    },
    animate: { 
      scale: 1,
      opacity: 1
    },
    hover: { 
      scale: 1.05,
      zIndex: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <CellContainer 
      cellType={cell.type}
      size={cellSize}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cellVariants}
      transition={{ 
        duration: 0.2,
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    />
  );
};

export default Cell; 