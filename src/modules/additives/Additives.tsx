import * as React from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { LoadingContext } from '../../contexts/LoaderContext';
import AdditivesState from './AdditivesState';
import { deepOrange, red, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  border: {
    border: '1px solid'
  },
  buttonCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  textField: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500]
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[300]),
    backgroundColor: deepOrange[300]
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500]
  },
  marginLeft: {
    marginLeft: theme.spacing(1)
  }
}));

const DangerComponent = ({ level }: { level: Number }) => {
  const classes = useStyles();

  if (level <= 1) {
    return <Avatar className={classes.green}>{level}</Avatar>;
  }

  if (level > 1 && level <= 3) {
    return <Avatar className={classes.orange}>{level}</Avatar>;
  }

  return <Avatar className={classes.red}>{level}</Avatar>;
};

const Additives = observer(() => {
  const history = useHistory();
  const classes = useStyles();
  const [state] = React.useState(() => new AdditivesState());
  const { startLoading, finishedLoadingSucces, finishedLoadingError } =
    React.useContext(LoadingContext);

  React.useEffect(() => {
    startLoading();
    state
      .load()
      .then(() => {
        finishedLoadingSucces();
      })
      .catch((err) => {
        finishedLoadingError(err);
      });
  }, [state.load, startLoading, finishedLoadingError, finishedLoadingSucces]);

  const goBack = React.useCallback(() => {
    history.push('/');
  }, [history]);

  const onFilterChange = React.useCallback(
    (ev) => {
      state.setFilter(ev.target.value);
    },
    [state.setFilter]
  );

  const loadMore = React.useCallback(() => state.loadMore(), [state]);

  return (
    <>
      <Typography gutterBottom variant="h5">
        Additives list
      </Typography>
      <Divider />
      <Box className={classes.flexBox}>
        <TextField
          value={state.filter}
          onChange={onFilterChange}
          id="outlined-search"
          label="Vyhledat éčko"
          type="search"
          variant="outlined"
        />
        <Box>
          <ButtonGroup
            className={classes.marginLeft}
            color="primary"
            aria-label="outlined primary button group">
            <Button onClick={goBack} className={classes.border} color="primary">
              Zpět na výpis
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <List className={classes.root}>
        {state.additivesArrShown.map((value, index) => {
          return (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <DangerComponent level={value.danger} />
              </ListItemAvatar>
              <ListItemText
                primary={value.code}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"></Typography>
                    {value.name}
                  </React.Fragment>
                }
              />
            </ListItem>
          );
        })}
      </List>
      <Box className={classes.buttonCenter}>
        <Button className={classes.border} onClick={loadMore} color="primary">
          Načíst další éčka...
        </Button>
      </Box>
    </>
  );
});

export default Additives;
