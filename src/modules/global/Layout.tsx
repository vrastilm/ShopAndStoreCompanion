import React from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
  Fab,
  Box,
  Grid,
  CircularProgress,
  Backdrop,
  Grow,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import useStyles from './LayoutStyles';
import { LoadingContext, LoadingState } from '../../contexts/LoaderContext';
import { observer } from 'mobx-react';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import { exportDb, importDb } from '../../database/indexedDb';
import { useHistory } from 'react-router-dom';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';

function Layout(props: any) {
  const classes = useStyles();
  const { loadingState, startLoading, finishedLoadingSucces, finishedLoadingError, errorMessage } =
    React.useContext(LoadingContext);
  const [openMenu, setOpenMenu] = React.useState(false);
  let history = useHistory();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: loadingState === LoadingState.Success,
    [classes.buttonError]: loadingState === LoadingState.Error
  });

  const bottomAppBarClassname = clsx({
    [classes.appBarError]: loadingState === LoadingState.Error
  });

  const handleMenuClick = React.useCallback(() => {
    setOpenMenu(true);
  }, [setOpenMenu]);

  const onCloseHandler = React.useCallback(() => {
    setOpenMenu(false);
  }, [setOpenMenu]);

  const onImportHandler = React.useCallback(() => {
    importDb(startLoading, setOpenMenu, finishedLoadingSucces, finishedLoadingError);
  }, [startLoading, setOpenMenu, finishedLoadingSucces, finishedLoadingError]);

  const onExportHandler = React.useCallback(async () => {
    try {
      startLoading();
      await exportDb();
      setOpenMenu(false);
      finishedLoadingSucces();
    } catch (err) {
      console.log(err);
      finishedLoadingError(err);
    }
  }, [startLoading, setOpenMenu, finishedLoadingSucces, finishedLoadingError]);

  const goToAdditives = React.useCallback(() => {
    setOpenMenu(false);
    history.push('/additives');
  }, [history]);

  return (
    <>
      <AppBar className={classes.appBarTop} position="fixed">
        <Box className={classes.header}>
          <Typography variant="h4" component="h1">
            Shop&Store companion
          </Typography>
        </Box>
      </AppBar>
      <Backdrop
        className={classes.backdrop}
        open={loadingState === LoadingState.Loading}></Backdrop>
      <Grid container>
        <Grid item xs={1} md={2} lg={3}></Grid>
        <Grid className={classes.marginBox} item xs={10} md={8} lg={6}>
          {props.children}
        </Grid>
        <Grid item xs={1} md={2} lg={3}></Grid>
      </Grid>
      <AppBar className={clsx(classes.appBar, bottomAppBarClassname)} position="fixed">
        <Toolbar className={classes.toolbar}>
          <Fab
            className={clsx(classes.fabButton, buttonClassname)}
            aria-label="menu"
            color="secondary"
            onClick={handleMenuClick}>
            <MenuIconSwitch loadingState={loadingState} />
          </Fab>
          {loadingState === LoadingState.Loading && (
            <CircularProgress size={68} className={classes.fabProgress} />
          )}
          <Grow in={loadingState === LoadingState.Error}>
            <Box className={classes.errorMessage}>
              <Typography variant="subtitle1">{errorMessage}</Typography>
            </Box>
          </Grow>
          <Box>
            <Typography variant="subtitle2">© 2020 Michal Vrastil v1.3</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        PaperProps={{ className: classes.drawer }}
        anchor="bottom"
        open={openMenu}
        onClose={onCloseHandler}>
        <List>
          <ListItem button key="additives" alignItems="center" onClick={goToAdditives}>
            <ListItemIcon>
              <BubbleChartIcon />
            </ListItemIcon>
            <ListItemText primary="Éčka" />
          </ListItem>
          <ListItem button key="import" alignItems="center" onClick={onImportHandler}>
            <ListItemIcon>
              <GetAppIcon />
            </ListItemIcon>
            <ListItemText primary="Nahrát databázi" />
          </ListItem>
          <ListItem button key="export" alignItems="center" onClick={onExportHandler}>
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText primary="Exportovat databázi" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

const MenuIconSwitch = ({ loadingState }: { loadingState: LoadingState }) => {
  switch (loadingState) {
    case LoadingState.Loading:
      return <></>;
    case LoadingState.Success:
      return <CheckIcon />;
    case LoadingState.Error:
      return <ErrorOutlineIcon />;
    default:
      return <MenuIcon />;
  }
};

export default observer(Layout);
