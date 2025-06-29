import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: transparent;
    border-radius: 50%;
  }

  .loader {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: transparent;
    width: 24px;
    height: 24px;
  }

  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: transparent;
    width: 24px;
    height: 24px;
    animation: spin89345 1s linear infinite;
  }

  @keyframes spin89345 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
