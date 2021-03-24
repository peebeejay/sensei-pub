import React, { FC, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { PlannerState, PlannerDispatch } from './PlannerProvider';
import { toggleToast } from './PlannerProvider/state';
import { noctisAzureus } from '../theme';

const StyledSnackbar = styled(Snackbar)`
  .MuiSnackbarContent-root {
    font-family: 'Courier Prime', monospace;
    font-weight: 600;
    background-color: ${noctisAzureus.snackbar.bg};
    color: ${noctisAzureus.snackbar.color};
  }
`;

const SimpleSnackbar: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { toastMessage } = useContext(PlannerState);
  const { updateState } = useContext(PlannerDispatch);

  useEffect(() => {
    if (toastMessage) {
      setOpen(true);
    }
  }, [toastMessage]);

  const handleClose = (
    _: React.SyntheticEvent<HTMLButtonElement>,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    updateState(toggleToast(''));
    setOpen(false);
  };

  return (
    <>
      <StyledSnackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={toastMessage}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
};

export default SimpleSnackbar;
