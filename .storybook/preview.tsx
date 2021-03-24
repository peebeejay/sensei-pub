// @ts-ignore
import React from 'react';
import { addDecorator } from '@storybook/react';
import styled from 'styled-components';
import { GlobalStyle } from '../src/globalStyles';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

addDecorator(story => (
  <Container>
    <GlobalStyle />
    {story()}
  </Container>
));
