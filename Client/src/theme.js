import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
   shadows: ['none'],
   palette: {
      primary: {
         main: '#4361ee',
      },
   },
   typography: {
      fontFamily: 'Manrope, sans-serif',
      button: {
         textTransform: 'none',
         fontWeight: 400,
      },
   },
});
