import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MazeAlgorithm, PathfindingAlgorithm } from '@/types/maze';

interface ControlPanelProps {
  onGenerateMaze: () => void;
  onFindPath: () => void;
  onReset: () => void;
  onClearPath: () => void;
  onMazeAlgorithmChange: (algorithm: MazeAlgorithm) => void;
  onPathfindingAlgorithmChange: (algorithm: PathfindingAlgorithm) => void;
  onSpeedChange: (speed: number) => void;
  selectedMazeAlgorithm: MazeAlgorithm;
  selectedPathfindingAlgorithm: PathfindingAlgorithm;
  animationSpeed: number;
  isGenerating: boolean;
  isFindingPath: boolean;
}

const Container = styled(motion.div)`
  border-radius: ${props => props.theme.shape.borderRadiusLarge};
  margin-bottom: 28px;
  color: ${props => props.theme.colors.text.primary};
  width: 100%;
  max-width: 900px;
  margin: 10px auto;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: ${props => props.theme.shape.borderRadius};
  border: 1px solid ${props => props.theme.colors.divider};
  background-color: ${props => props.theme.colors.background.default};
  color: ${props => props.theme.colors.text.primary};
  font-size: 15px;
  font-family: ${props => props.theme.typography.fontFamily};
  cursor: pointer;
  transition: all 0.2s ${props => props.theme.transitions.easing.easeInOut};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.light}40;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.paper};
    color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RangeInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.colors.divider};
  outline: none;
  margin: 10px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary.main};
    cursor: pointer;
    transition: transform 0.2s ${props => props.theme.transitions.easing.easeOut};
    box-shadow: ${props => props.theme.shadows[1]};
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary.main};
    cursor: pointer;
    border: none;
    transition: transform 0.2s ${props => props.theme.transitions.easing.easeOut};
    box-shadow: ${props => props.theme.shadows[1]};
  }
  
  &::-moz-range-thumb:hover {
    transform: scale(1.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeedLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled(motion.button)<{ $primary?: boolean; $danger?: boolean; $secondary?: boolean }>`
  padding: 12px 16px;
  border-radius: ${props => props.theme.shape.borderRadius};
  border: none;
  font-size: 14px;
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background-color: ${(props) =>
    props.$primary
      ? props.theme.colors.primary.main
      : props.$danger
      ? props.theme.colors.error.main
      : props.$secondary
      ? props.theme.colors.secondary.main
      : props.theme.colors.background.paper};
  color: ${(props) =>
    props.$primary || props.$danger
      ? props.theme.colors.text.white
      : props.$secondary
      ? props.theme.colors.text.primary
      : props.theme.colors.text.secondary};
  box-shadow: ${props => props.theme.shadows[2]};
  transition: all 0.2s ${props => props.theme.transitions.easing.easeInOut};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows[4]};
    background-color: ${(props) =>
      props.$primary
        ? props.theme.colors.primary.dark
        : props.$danger
        ? props.theme.colors.error.dark
        : props.$secondary
        ? props.theme.colors.secondary.dark
        : props.theme.colors.background.paper};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.divider};
    color: ${props => props.theme.colors.text.disabled};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerateMaze,
  onFindPath,
  onReset,
  onClearPath,
  onMazeAlgorithmChange,
  onPathfindingAlgorithmChange,
  onSpeedChange,
  selectedMazeAlgorithm,
  selectedPathfindingAlgorithm,
  animationSpeed,
  isGenerating,
  isFindingPath,
}) => {
  return (
    <Container
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ControlGroup>
        <Label>Maze Generation Algorithm</Label>
        <Select
          value={selectedMazeAlgorithm}
          onChange={(e) => onMazeAlgorithmChange(e.target.value as MazeAlgorithm)}
          disabled={isGenerating || isFindingPath}
        >
          {Object.values(MazeAlgorithm).map((algorithm) => (
            <option key={algorithm} value={algorithm}>
              {algorithm}
            </option>
          ))}
        </Select>
      </ControlGroup>
      
      <ControlGroup>
        <Label>Pathfinding Algorithm</Label>
        <Select
          value={selectedPathfindingAlgorithm}
          onChange={(e) => onPathfindingAlgorithmChange(e.target.value as PathfindingAlgorithm)}
          disabled={isGenerating || isFindingPath}
        >
          {Object.values(PathfindingAlgorithm).map((algorithm) => (
            <option key={algorithm} value={algorithm}>
              {algorithm}
            </option>
          ))}
        </Select>
      </ControlGroup>
      
      <ControlGroup>
        <Label>Animation Speed</Label>
        <RangeContainer>
          <RangeInput
            type="range"
            min="1"
            max="100"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            disabled={isGenerating || isFindingPath}
          />
          <SpeedLabel>
            <span>Slow</span>
            <span>Fast</span>
          </SpeedLabel>
        </RangeContainer>
      </ControlGroup>
      
      <ButtonGroup>
        <Button
          $primary
          onClick={onGenerateMaze}
          disabled={isGenerating || isFindingPath}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Maze'}
        </Button>
        
        <Button
          $secondary
          onClick={onFindPath}
          disabled={isGenerating || isFindingPath}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isFindingPath ? 'Finding Path...' : 'Find Path'}
        </Button>
        
        <Button
          onClick={onClearPath}
          disabled={isGenerating || isFindingPath}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Clear Path
        </Button>
        
        <Button
          $danger
          onClick={onReset}
          disabled={isGenerating || isFindingPath}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default ControlPanel; 