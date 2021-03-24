import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { Droppable } from 'react-beautiful-dnd';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { noctisAzureus as na } from '../theme';

type Props = {
  children?: React.ReactNode;
  uponClick: React.MouseEventHandler<HTMLDivElement>;
  isFlipped: boolean;
  impliedId: string;
};

const IconStyles = css`
  && {
    height: ${rem(30)};
    width: ${rem(30)};
    cursor: pointer;
    transition: 200ms height ease, 200ms width ease;
    color: ${na.weekDrop.iconColor};
  }
`;

const BeforeIcon = styled(NavigateBeforeIcon)`
  ${IconStyles}
`;

const AfterIcon = styled(NavigateNextIcon)`
  ${IconStyles}
`;

const Container = styled.div<{
  isDraggingOver: boolean;
  isFlipped: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${rem(40)};
  flex: 1;
  background-color: ${na.weekDrop.bg};
  transition: 200ms background-color ease;
  cursor: pointer;
  will-change: width;

  &:hover {
    background-color: ${na.weekDrop.bgHover};
    ${BeforeIcon}, ${AfterIcon} {
      height: ${rem(50)};
      width: ${rem(50)};
    }
  }

  &:active {
    background-color: ${na.weekDrop.bgActive};
  }

  ${(props) =>
    props.isDraggingOver &&
    `
      background-color: ${na.weekDrop.bgDragging};
      ${BeforeIcon}, ${AfterIcon} {
        color: ${na.weekDrop.iconColorDragging};
        height: ${rem(50)};
        width: ${rem(50)};
      }
      &:hover {
        background-color: ${na.weekDrop.bgDragging};
      }
    `}
`;

const WeekDrop: FC<Props> = (props) => {
  const { uponClick, isFlipped, impliedId } = props;
  return (
    <Droppable droppableId={impliedId}>
      {(provided, snapshot) => (
        <Container
          isFlipped={isFlipped}
          onClick={uponClick}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {isFlipped ? <AfterIcon /> : <BeforeIcon />}
        </Container>
      )}
    </Droppable>
  );
};

export default WeekDrop;
