import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Noctis } from '../colors';
import { Helmet as ReactHelmet } from 'react-helmet';
import MUTextField from '@material-ui/core/TextField';
import Ima from './icons/Ima';
import { noctisAzureus as na } from '../theme';

type Props = {
  setIsShowing: Dispatch<SetStateAction<boolean>>;
};

const TextField = styled(MUTextField)`
  input {
    color: white;
  }
  .MuiInput-underline:after {
    border-bottom-color: ${na.login.color};
  }
  .MuiInput-underline:before {
    border-bottom-color: ${Noctis.GoldSand};
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    transition: 200ms border-color ease;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom-color: ${na.login.color};
  }
`;

const Header = styled.header`
  background-color: ${Noctis.bgAzureus};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Logo = styled(Ima)`
  height: 40vmin;
  width: 40vmin;
  pointer-events: none;
  fill: ${na.login.color};
`;

const Name = styled.div`
  color: ${na.login.color};
  font-size: ${rem(20)};
  font-weight: 600;
`;

const Login: FC<Props> = (props: Props) => {
  const { setIsShowing } = props;
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Header>
      <ReactHelmet>
        <meta charSet="utf-8" />
        <title>{`Sensei | PuntaNET`}</title>
        <link rel="canonical" href="https://sensei.puntanet.dev" />
      </ReactHelmet>
      <Logo />
      <Name>{'- sensei -'}</Name>
      <form
        onSubmit={async (e: React.SyntheticEvent) => {
          e.preventDefault();
          setIsLoading(true);
          const res = await fetch(
            'https://us-central1-sensei-dev-1.cloudfunctions.net/puntanet-auth-v2',
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify({
                password: password,
              }),
            },
          );

          if (res.ok) {
            setIsShowing(true);
            setIsError(false);
            setIsLoading(false);
            setPassword('');
            const data = await res.json();
            localStorage.setItem('jwt', data.jwt);
          } else {
            setIsError(true);
            setIsLoading(false);
          }
        }}
      >
        <TextField
          id="password-login"
          error={isError}
          autoFocus
          value={password}
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setPassword(e.target.value);
          }}
          disabled={isLoading}
        />
      </form>
    </Header>
  );
};

export default Login;
