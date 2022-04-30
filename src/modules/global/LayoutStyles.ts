import { makeStyles } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    zIndex: 991,
    bottom: 0
  },
  toolbar: {
    flexDirection: 'column'
  },
  appBarSucces: {
    backgroundColor: green[300]
  },
  appBarError: {
    backgroundColor: red[300]
  },
  appBarTop: {
    bottom: 'auto',
    zIndex: 991,
    top: 0
  },
  fabButton: {
    top: -30,
    zIndex: 991,
    left: 0,
    right: 0,
    margin: '0 auto'
  },
  header: {
    margin: theme.spacing(2),
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex'
  },
  marginBox: {
    marginBottom: theme.spacing(18),
    marginTop: theme.spacing(11)
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700]
    }
  },
  fabProgress: {
    color: green[500],
    zIndex: 991,
    top: -36,
    left: 0,
    right: 0,
    margin: '0 auto',
    position: 'absolute'
  },
  backdrop: {
    zIndex: 990,
    color: '#fff'
  },
  errorMessage: {
    paddingBottom: '24px'
  },
  drawer: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export default useStyles;
