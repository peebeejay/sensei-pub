import React, { FC } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { DateTime } from 'luxon';
import { noctisAzureus as na } from '../theme';

type Props = {
  date: DateTime;
  isDraggingOver: boolean;
};

export const StyledDayHeader = styled.div<{
  isPast: boolean;
  isWeekend: boolean;
  isDraggingOver: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${rem(10)} ${rem(15)} ${rem(0)};
  background-color: ${(props) => {
    if (props.isWeekend) {
      return na.planner.bgWeekend;
    } else {
      return na.planner.bg;
    }
  }};
  color: ${(props) =>
    props.isPast ? na.day.colorDateNumberPast : na.day.colorDateNumber};
  transition: background 400ms ease;
`;

const DayCalendar = styled.div<{
  isToday: boolean;
}>`
  height: ${rem(42)};
  width: ${rem(42)};
  font-size: ${rem(26)};
  line-height: ${rem(26)};
  font-weight: 600;
  cursor: pointer;
  padding: ${rem(6)};
  padding-top: ${rem(10)};
  border-radius: 50%;
  transition: 100ms background-color ease;
  user-select: none;

  &:hover {
    background-color: ${na.day.bgHover};
  }

  ${(props) =>
    props.isToday &&
    `
    background-color: ${na.day.bgToday};
    color: ${na.day.colorDateNumberToday};

    &:hover {
      background-color: ${na.day.bgTodayHover};
    }`}
`;

const DayOfWeek = styled.div<{
  isToday: boolean;
}>`
  font-weight: 600;
  font-size: ${rem(20)};
  margin-bottom: ${rem(3)};
  user-select: none;
  color: ${na.day.colorDayOfWeek};

  ${(props) =>
    props.isToday &&
    `
    color: ${na.day.bgTodayHover};`};
`;

const DayHeader: FC<Props> = (props) => {
  const { date, isDraggingOver } = props;
  const isToday = date.hasSame(DateTime.local(), 'day');
  const isPast = date < DateTime.local();
  const isWeekend = ['6', '7'].includes(date.toFormat('c'));
  return (
    <StyledDayHeader
      isDraggingOver={isDraggingOver}
      isWeekend={isWeekend}
      isPast={isPast}
    >
      <DayOfWeek isToday={isToday}>{`${date.toFormat('cccc').toLowerCase()}`}</DayOfWeek>
      <DayCalendar isToday={isToday}>{`${date.toFormat('dd')}`}</DayCalendar>
    </StyledDayHeader>
  );
};

export default DayHeader;
