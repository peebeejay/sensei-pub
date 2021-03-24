import React, { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import decode from 'jwt-decode';
import { StylesProvider } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import PlannerProvider from './PlannerProvider';
import Planner from './Planner';
import Nav from './Nav';
import HotKeys from './HotKeys';
import Snackbar from './Snackbar';
import Helmet from './Helmet';
import { Noctis } from '../colors';
import { Token } from '../types';
import Login from './Login';

export const PlannerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  background-color: ${Noctis.bgAzureus};
`;

const Container = styled.div`
  font-family: 'Courier Prime', monospace;
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: FC = () => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  /**
   * This hook is used to check whether the user current browser has a valid jwt token in storage
   */
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const payload = decode<Token>(token);
      const exp = DateTime.fromSeconds(payload.exp);
      if (exp > DateTime.local()) {
        setIsShowing(true);
      } else if (exp < DateTime.local()) {
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('jwt');
    setIsShowing(false);
  }, []);

  return (
    <StylesProvider injectFirst>
      <Container>
        <Switch>
          <Route path={['/', '/calendar/week/:year/:month/:day']}>
            {!isShowing && <Login setIsShowing={setIsShowing} />}
            {isShowing && (
              <PlannerProvider>
                <Nav handleLogout={handleLogout} />
                <PlannerWrapper>
                  <Planner />
                </PlannerWrapper>
                <HotKeys />
                <Snackbar />
                <Helmet />
              </PlannerProvider>
            )}
          </Route>
        </Switch>
      </Container>
    </StylesProvider>
  );
};

export default App;
