import React, { FC, useContext, useCallback } from 'react';
import styled from 'styled-components';
import { rem, lighten } from 'polished';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from '@material-ui/core/Tooltip';
import { PlannerState, PlannerDispatch } from './PlannerProvider';
import { changeStartDate, revertStartDate } from './PlannerProvider/state';
import { getFirstDayOfThisWeek } from '../utils';
import Ima from './icons/Ima';
import { noctisAzureus as na } from '../theme';

type Props = {
  handleLogout: () => void;
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${rem(50)};
  border-bottom: ${rem(1)} solid ${na.borders.separator1};
  padding: ${rem(8)} ${rem(43)};
  color: ${na.nav.textColor};
  z-index: 0;
  background-color: ${na.nav.bg};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: ${rem(10)};
  justify-content: space-between;
  align-items: center;
`;

const NavButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${rem(35)};
  min-width: ${rem(35)};
  border-radius: 50%;
  background-color: transparent;
  transition: 200ms background-color ease;
  cursor: pointer;
  color: ${na.nav.navButtonColor};

  &:hover {
    background-color: ${lighten(0.2, na.nav.buttonHover)};
  }

  &:active {
    background-color: ${lighten(0.4, na.nav.buttonHover)};
  }
`;

const TipContent = styled.span`
  font-size: ${rem(12)};
  font-weight: 600;
`;

const Month = styled.div`
  font-size: ${rem(22)};
  font-weight: 600;
  line-height: ${rem(28)};
  letter-spacing: 0;
  white-space: nowrap;
  margin-left: ${rem(8)};
  margin-right: ${rem(2)};
  user-select: none;
  padding: ${rem(8)};
`;

const WeekNumber = styled.div`
  background-color: ${na.nav.weekButtonBg};
  color: ${na.nav.weekButtonColor};
  font-size: ${rem(14)};
  font-weight: 600;
  letter-spacing: ${rem(0.3)};
  line-height: ${rem(22)};
  vertical-align: top;
  user-select: none;
  padding: 0 ${rem(6)};
  min-width: ${rem(65)};
  margin-bottom: ${rem(4)};
`;

const Today = styled.div`
  display: flex;
  flex-direction row;
  justify-content: center;
  align-items: center;
  height: ${rem(36)};
  background-color: transparent;
  border: ${rem(1)} solid ${na.borders.separator5};
  transition: 150ms background-color ease;
  line-height: ${rem(20)};
  cursor: pointer;
  font-size: ${rem(16)};
  font-weight: 600;
  outline: none;
  text-align: center;
  color: ${na.nav.textColor};
  user-select: none;
  width: ${rem(90)};

  &:hover {
    background-color: ${na.nav.buttonHover};
  }

  &:active {
    background-color: ${lighten(0.2, na.nav.buttonHover)};
  }
`;

const ImaLogo = styled(Ima)`
  height: 4vmin;
  width: 4vmin;
  user-select: none;
  flex: 1;
  fill: ${na.nav.iconColor};
`;

const WeekNav = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  flex: 1;
`;

const Logout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
`;

const LogoutButton = styled.div`
  display: flex;
  flex-direction row;
  justify-content: center;
  align-items: center;
  height: ${rem(36)};
  background-color: transparent;
  border: ${rem(1)} solid ${na.borders.separator5};
  transition: 150ms background-color ease;
  line-height: ${rem(20)};
  cursor: pointer;
  font-size: ${rem(16)};
  font-weight: 600;
  outline: none;
  text-align: center;
  color: ${na.nav.textColor};
  width: ${rem(90)};
  user-select: none;

  &:hover {
    background-color: ${na.nav.buttonHover};
  }

  &:active {
    background-color: ${lighten(0.2, na.nav.buttonHover)};
  }
`;

const Nav: FC<Props> = (props) => {
  const { handleLogout } = props;
  const { startDate } = useContext(PlannerState);
  const { updateState } = useContext(PlannerDispatch);

  const handleTodayOnClick = useCallback(() => {
    const isThisWeek = getFirstDayOfThisWeek().equals(startDate);
    if (!isThisWeek) {
      updateState(revertStartDate());
    }
  }, [startDate]);

  return (
    <Container>
      <WeekNav>
        <Tooltip title={<TipContent>{startDate.toFormat('cccc, LLLL d')}</TipContent>}>
          <Today onClick={handleTodayOnClick}>
            <span>{'today'}</span>
          </Today>
        </Tooltip>
        <Buttons>
          <Tooltip title={<TipContent>{'previous week'}</TipContent>}>
            <NavButton onClick={() => updateState(changeStartDate(-1))}>
              <NavigateBeforeIcon />
            </NavButton>
          </Tooltip>
          <Tooltip title={<TipContent>{'next week'}</TipContent>}>
            <NavButton onClick={() => updateState(changeStartDate(1))}>
              <NavigateNextIcon />
            </NavButton>
          </Tooltip>
        </Buttons>
        <Month>{startDate.toFormat('LLLL yyyy').toLowerCase()}</Month>
        <WeekNumber>{`week ${startDate.toFormat('WW')}`}</WeekNumber>
      </WeekNav>
      <ImaLogo />
      <Logout>
        <LogoutButton onClick={handleLogout}>{'logout'}</LogoutButton>
      </Logout>
    </Container>
  );
};

export default Nav;
