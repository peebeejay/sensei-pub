import { FC, useEffect, useContext, useCallback } from 'react';
import { PlannerState, PlannerDispatch } from './PlannerProvider';
import { changeStartDate } from './PlannerProvider/state';
import { Keys } from '../types';

const HotKeys: FC = () => {
  const { disableGlobalHotKeys } = useContext(PlannerState);
  const { updateState } = useContext(PlannerDispatch);

  /**
   * This hook essentially creates a permanend keypress listener, unless it's disabled
   * during ex: adding a new task
   */
  useEffect(() => {
    if (!disableGlobalHotKeys) {
      document.addEventListener('keydown', handleKeyPress, false);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [disableGlobalHotKeys]);

  /**
   * This handler is a switchboard that detects and handles key presses, and performs
   * actions associated with those keypresses
   */
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === Keys.J) {
      updateState(changeStartDate(1));
    } else if (e.key === Keys.K) {
      updateState(changeStartDate(-1));
    }
  }, []);

  return null;
};

export default HotKeys;
