import { createGlobalStyle } from 'styled-components';

export const fontUrl =
  'https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap';

export const GlobalStyle = createGlobalStyle`
  html {
    overflow: hidden;
    height: 100%;
  }

  body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    height: 100%;
    overflow: auto;
    font-size: 0.875rem
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }

  [type=text], [type=tel], [type=email], [type=password], [type=number], [type=date], [type=search], textarea {
    padding: .5rem;
    font-size: .875rem;
    line-height: 1;
    color: #4E5A5E;
  }
`;
