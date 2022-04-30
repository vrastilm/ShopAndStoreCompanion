import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import RobotoLight from '../../../fonts/RobotoLight.ttf';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: '#29b6f6'
    }
  },
  typography: {
    fontFamily: [
      'RobotoLight',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [RobotoLight]
      }
    }
  }
});

export default responsiveFontSizes(theme);
