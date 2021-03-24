import { Azureus, Noctis } from './colors';
import { lighten, darken } from 'polished';

type Theme = {
  borders: {
    separator1: string;
    separator5: string;
  };
  planner: {
    bg: string;
    bgWeekend: string;
  };
  day: {
    colorDayOfWeek: string;
    colorDateNumber: string;
    colorDateNumberToday: string;
    colorDateNumberPast: string;
    bgHover: string;
    bgToday: string;
    bgTodayHover: string;
  };
  nav: {
    bg: string;
    textColor: string;
    weekButtonBg: string;
    weekButtonColor: string;
    buttonHover: string;
    navButtonColor: string;
    iconColor: string;
  };
  taskCard: {
    bg: string;
    bgEditing: string;
    color: string;
    colorEditing: string;
    id: string;
    colorDeleteIcon: string;
    colorDeleteIconStaged: string;
    check: {
      /* default */
      borderColor: string;
      color: string;
      fill: string;
      /* active */
      borderColorActive: string;
      backgroundColorActive: string;
      colorActive: string;
      /* hover */
      borderColorHover: string;
      backgroundColorHover: string;
      colorHover: string;
      /* complete */
      borderColorComplete: string;
      backgroundColorComplete: string;
      colorComplete: string;
      /* complete hover */
      borderColorCompleteHover: string;
      backgroundColorCompleteHover: string;
      colorCompleteHover: string;
      /* complete active */
      borderColorCompleteActive: string;
      backgroundColorCompleteActive: string;
      colorCompleteActive: string;
    };
  };
  add: {
    bg: string;
    bgHover: string;
    bgAdding: string;
    bgActive: string;
    iconColor: string;
    iconColorHover: string;
    textAreaColor: string;
    textAreaIsStagedColor: string;
    textAreaIsLoadingColor: string;
    textColor: string;
  };
  weekDrop: {
    bg: string;
    bgHover: string;
    bgActive: string;
    bgDragging: string;
    iconColor: string;
    iconColorDragging: string;
  };
  snackbar: {
    bg: string;
    color: string;
  };
  login: {
    color: string;
  };
};

export const noctisAzureus: Theme = {
  borders: {
    separator1: Azureus.black1,
    separator5: Azureus.blue2,
  },
  planner: {
    bg: Azureus.blue5,
    bgWeekend: Azureus.blue4,
  },
  day: {
    colorDayOfWeek: Noctis.Galliano,
    colorDateNumber: Azureus.blue0,
    colorDateNumberToday: Azureus.blue5,
    colorDateNumberPast: darken(0.2, Azureus.blue0),
    bgHover: lighten(0.1, Azureus.blue4),
    bgToday: Azureus.blue0,
    bgTodayHover: lighten(0.1, Azureus.blue0),
  },
  nav: {
    bg: Azureus.blue4,
    textColor: Noctis.Galliano,
    weekButtonBg: Noctis.EasternBlue,
    weekButtonColor: Azureus.blue5,
    buttonHover: Azureus.blue3,
    navButtonColor: Noctis.Galliano,
    iconColor: Noctis.Galliano,
  },
  taskCard: {
    bg: Azureus.blue6,
    bgEditing: Azureus.blue5,
    color: Azureus.white1,
    colorEditing: Noctis.Eucalyptus,
    id: Noctis.MountainMeadow,
    colorDeleteIcon: Noctis.SmaltBlue,
    colorDeleteIconStaged: Noctis.Cinnabar,
    check: {
      /* default */
      borderColor: Noctis.Galliano,
      color: Noctis.Galliano,
      fill: Noctis.Cinnabar,
      /* active */
      borderColorActive: Noctis.Cinnabar,
      backgroundColorActive: Azureus.blue6,
      colorActive: Noctis.Cinnabar,
      /* hover */
      borderColorHover: Noctis.Galliano,
      backgroundColorHover: Azureus.blue4,
      colorHover: Noctis.GoldSand,
      /* complete */
      borderColorComplete: Noctis.Galliano,
      backgroundColorComplete: Noctis.Galliano,
      colorComplete: Azureus.blue6,
      /* complete hover */
      borderColorCompleteHover: Noctis.GoldSand,
      backgroundColorCompleteHover: Noctis.GoldSand,
      colorCompleteHover: Azureus.blue6,
      /* complete active */
      borderColorCompleteActive: Noctis.Cinnabar,
      backgroundColorCompleteActive: Noctis.Cinnabar,
      colorCompleteActive: Azureus.blue6,
    },
  },
  add: {
    bg: Azureus.blue7,
    bgHover: Azureus.blue6,
    bgAdding: Azureus.blue6,
    bgActive: lighten(0.01, Azureus.blue6),
    iconColor: Noctis.Galliano,
    iconColorHover: Noctis.CornflowerBlue,
    textAreaColor: Azureus.blue7,
    textAreaIsStagedColor: Azureus.blue6,
    textAreaIsLoadingColor: Azureus.blue6,
    textColor: Noctis.Eucalyptus,
  },
  weekDrop: {
    bg: Azureus.blue7,
    bgHover: darken(0.1, Azureus.blue3),
    bgActive: Azureus.blue3,
    bgDragging: Noctis.Galliano,
    iconColor: Noctis.Galliano,
    iconColorDragging: Azureus.blue4,
  },
  snackbar: {
    bg: Azureus.blue7,
    color: Noctis.Galliano,
  },
  login: {
    color: Noctis.Galliano,
  },
};
