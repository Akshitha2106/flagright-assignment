import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#e0e0e0',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9fa8da',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#1a1a2e',
      paper: '#161625',
    },
  },
});
