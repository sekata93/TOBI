import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1abc9c', // hijau toska
      contrastText: '#fff',
    },
    secondary: {
      main: '#16a085', // hijau toska tua
    },
    background: {
      default: '#e8f8f5', // hijau toska muda
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default theme;
