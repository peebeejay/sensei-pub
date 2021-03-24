import { DateTime } from 'luxon';
import { DAYS_IN_WEEK, DATE_FORMAT } from '../../constants';
import { State } from './state';

/**
 * This function generates a new state.tasks object for 3 weeks (21 days). It by nature retains task data
 * for days that already exist in state, and additionally generates new empty objects for days that haven't
 * been seen prior.
 */
export const generateDateKeys = (startDate: DateTime, state: State) => {
  return [...Array(DAYS_IN_WEEK * 3).keys()]
    .map((i) => startDate.minus({ days: 7 }).plus({ days: i }).toFormat(DATE_FORMAT))
    .reduce((memo, date) => {
      return {
        ...memo,
        [date]: {
          tasks: state.tasks[date]?.tasks ? state.tasks[date].tasks : {},
          loading: false,
        },
      };
    }, {} as State['tasks']);
};
