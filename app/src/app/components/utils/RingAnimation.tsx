// app/src/app/components/utils/RingAnimation.tsx
import styled, { keyframes } from "styled-components";

const motion = () => keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
`;

interface RingSpinnerProps {
  color: string;
  size: number;
  $unit: string;
}

const RingSpinner = styled.div<RingSpinnerProps>`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: ${(p) => `${p.size}${p.$unit}`};
  height: ${(p) => `${p.size}${p.$unit}`};
  margin: 6px;
  border: 6px solid ${(p) => p.color};
  border-radius: 50%;
  animation: ${motion} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${(p) => p.color} transparent transparent transparent;

  :nth-child(1) {
    animation-delay: -0.45s;
  }
  :nth-child(2) {
    animation-delay: -0.3s;
  }
  :nth-child(3) {
    animation-delay: -0.15s;
  }
`;

interface RingAnimationProps {
  color?: string;
  size?: number;
  unit?: string;
}

export const RingAnimation: React.FC<RingAnimationProps> = ({
  color = "rgb(46 121 220)",
  size = 50,
  unit = "px",
}) => (
  <Wrapper>
    <RingSpinner color={color} size={size} $unit={unit} />
  </Wrapper>
);
