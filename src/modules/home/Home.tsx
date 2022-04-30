import React from 'react';
import {
  Typography,
  IconButton,
  makeStyles,
  Box,
  Divider,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { observer } from 'mobx-react';
import HomeState from './HomeState';
import AddShopItem from '../shopList/AddShopItem';
import { LoadingContext, LoadingState } from '../../contexts/LoaderContext';
import IShopItem from '../shopList/interfaces/IShopItem';
import { dateFormat } from '../shopList/ShopListState';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  border: {
    border: '1px solid'
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  card: {
    marginTop: theme.spacing(2)
  },
  paginator: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  marginMenu: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));

function Home() {
  const [state] = React.useState(() => new HomeState());

  return (
    <>
      <Typography gutterBottom variant="h5">
        Položky a ceny
      </Typography>
      <Divider />
      {state.isAdding ? (
        <AddShopItem toggleAdding={state.toggleAdding} selectedItem={state.selectedItem} />
      ) : (
        <Overview state={state} />
      )}
    </>
  );
}

function _Overview({ state }: { state: HomeState }) {
  const classes = useStyles();
  const addCallback = React.useCallback(() => state.toggleAdding(), [state.toggleAdding]);
  const { loadingState, startLoading, finishedLoadingSucces, finishedLoadingError } =
    React.useContext(LoadingContext);

  React.useEffect(() => {
    state.selectedItem = void 0;
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

  const onDeleteCallback = React.useCallback(
    async (item) => {
      try {
        startLoading();
        await state.removeItem(item);
        finishedLoadingSucces();
        window.location.reload(false);
      } catch (err) {
        console.log(err);
        finishedLoadingError(err);
      }
    },
    [state.removeItem, startLoading, finishedLoadingSucces, finishedLoadingError]
  );

  const onFilterChange = React.useCallback(
    (ev) => {
      state.setFilter(ev.target.value);
    },
    [state.setFilter]
  );

  const onEditCallback = React.useCallback(
    (item) => {
      state.selectedItem = item;
      state.isAdding = true;
    },
    [state]
  );

  const paginationCallback = React.useCallback(
    (event: object, page: number) => {
      state.setPage(page);
    },
    [state]
  );

  const setFIlterCriterionCallback = React.useCallback(
    (ev) => {
      state.setFilterCriterion(ev.target.value);
    },
    [state]
  );

  return (
    <Box>
      <Box className={classes.flexBox}>
        <TextField
          value={state.filter}
          onChange={onFilterChange}
          id="outlined-search"
          label="Vyhledat položku"
          type="search"
          variant="outlined"
        />

        <Box className={classes.marginMenu}>
          <Select
            id="select-criterion"
            value={state.filterCriterion}
            onChange={setFIlterCriterionCallback}>
            <MenuItem value={'name'}>Name</MenuItem>
            <MenuItem value={'specie'}>Specie</MenuItem>
            <MenuItem value={'shop'}>Shop</MenuItem>
          </Select>
        </Box>
        <Box>
          <IconButton
            disabled={loadingState !== LoadingState.Idle}
            onClick={addCallback}
            className={classes.border}
            size="medium"
            color="primary">
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
      {state.shopItemsShown.map((val: IShopItem, idx: number) => (
        <Card className={classes.card} key={idx} variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {val.name}
            </Typography>
            <Divider />
            <Grid container>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Druh: {val.specie}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Cena: {val.price}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Datup: {val.date.toFormat(dateFormat)}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Obchod: {val.shop.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Velikost: {val.size}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Jednotka: {val.unit.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="subtitle1">Poznámka: {val.note}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => onDeleteCallback(val)} size="small">
              <Delete />
            </IconButton>
            <IconButton onClick={() => onEditCallback(val)} size="small">
              <Edit />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      <Box className={classes.paginator}>
        <Pagination
          count={state.pageCount}
          page={state.currentPage}
          onChange={paginationCallback}
          color="primary"
        />
      </Box>
    </Box>
  );
}
const Overview = observer(_Overview);

export default observer(Home);
