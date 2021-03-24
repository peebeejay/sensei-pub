import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import TaskCard from '../components/TaskCard';
import { DateTime } from 'luxon';
import { DATE_FORMAT } from '../constants';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Task Card',
};

const Wrapper = styled.div`
  margin: ${rem(20)};
  max-width: ${rem(300)};
`;

export const singleTask = () => {
  const isLoading = boolean('Loading', false);
  const testTask = {
    id: '732',
    is_complete: false,
    title: `“Change will not come if we wait for some other person, or if we wait for some other time."`,
    due_date: DateTime.local().toFormat(DATE_FORMAT),
    created_on: DateTime.local().toFormat(DATE_FORMAT),
    name: 'Lorem',
    description: 'A sample description is here',
    index: 0,
  };

  return (
    <Wrapper>
      <TaskCard
        isDragging={false}
        task={{
          ...testTask,
          is_complete: isLoading,
        }}
        listId={'123'}
      />
    </Wrapper>
  );
};
