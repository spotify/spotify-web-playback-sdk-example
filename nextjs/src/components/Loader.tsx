import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  padding-top: 48px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const spin = keyframes`
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
`;

const Ring = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
`;

const FirstRing = styled(Ring)`
  animation-delay: -0.45s;
`;
const SecondRing = styled(Ring)`
  animation-delay: -0.3s;
`;
const ThirdRing = styled(Ring)`
  animation-delay: -0.15s;
`;

export const Loader = () => {
  return (
    <Container>
      <Wrapper>
        <FirstRing />
        <SecondRing />
        <ThirdRing />
        <Ring />
      </Wrapper>
    </Container>
  );
};
