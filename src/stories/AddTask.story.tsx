import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { boolean } from '@storybook/addon-knobs';
import AddTask from '../components/AddTask';

export default {
  title: 'Add Task',
};

const Wrapper = styled.div`
  margin: ${rem(20)};
  max-width: ${rem(300)};
`;

export const singleTask = () => {
  const isLoading = boolean('Loading', false);
  return (
    <Wrapper>
      <AddTask listId="listID-1" loading={!!isLoading} date="2020-05-22" size={0} />
    </Wrapper>
  );
};
