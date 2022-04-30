import React from 'react';
import {
  InputLabel,
  FormControl,
  makeStyles,
  Box,
  Select,
  Button,
  ButtonGroup,
  TextField,
  MenuItem,
  InputAdornment
} from '@material-ui/core';
import { observer } from 'mobx-react';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import ShopListState, { dateFormat } from './ShopListState';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { LoadingContext, LoadingState } from '../../contexts/LoaderContext';
import IShopItem from './interfaces/IShopItem';

const useStyles = makeStyles((theme) => ({
  border: {
    border: '1px solid'
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  textField: {
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '100%'
  }
}));

function _AddShopItem({
  toggleAdding,
  selectedItem
}: {
  toggleAdding: Function;
  selectedItem: IShopItem;
}) {
  const classes = useStyles();
  const [state] = React.useState(() => new ShopListState());
  const formRef = React.useRef(null);
  const { loadingState, startLoading, finishedLoadingSucces, finishedLoadingError } =
    React.useContext(LoadingContext);

  React.useEffect(() => {
    state.loadItem(selectedItem);
  }, [state]);

  const onCancelCallback = React.useCallback(() => {
    state.clear();
    toggleAdding();
  }, [state.clear, toggleAdding]);

  const onSaveCallback = React.useCallback(async () => {
    try {
      startLoading();
      await state.saveItem();
      finishedLoadingSucces();
    } catch (err) {
      finishedLoadingError(err);
    }
  }, [state.saveItem, startLoading, finishedLoadingSucces, finishedLoadingError]);

  return (
    <Box>
      <ValidatorForm
        ref={formRef}
        onSubmit={onSaveCallback}
        onError={() => finishedLoadingError('Jedna nebo více položek má neplatná data')}>
        <Box className={classes.flexBox}>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button
              disabled={loadingState !== LoadingState.Idle}
              onClick={onCancelCallback}
              className={classes.border}
              color="primary">
              Zpět na výpis
            </Button>
            <Button
              disabled={loadingState !== LoadingState.Idle}
              type="submit"
              className={classes.border}
              color="primary">
              Uložit
            </Button>
          </ButtonGroup>
        </Box>
        <TextValidator
          className={classes.textField}
          value={state.name}
          onChange={(ev) => state.changeItem('name', ev.target.value)}
          label="Název"
          name="Item name"
          validators={['required']}
          errorMessages={['Toto pole je povinné']}
        />

        <TextValidator
          className={classes.textField}
          value={state.specie}
          onChange={(ev) => state.changeItem('specie', ev.target.value)}
          label="Druh"
          name="Item specie"
          validators={['required']}
          errorMessages={['Toto pole je povinné']}
        />

        <TextValidator
          className={classes.textField}
          value={state.price}
          onChange={(ev) => state.changeItem('price', ev.target.value)}
          label="Cena"
          name="Price"
          validators={['required']}
          errorMessages={['Toto pole je povinné']}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <span>Kč</span>
              </InputAdornment>
            )
          }}
        />

        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <KeyboardDatePicker
            className={classes.textField}
            disableToolbar
            variant="inline"
            format={dateFormat}
            margin="normal"
            id="date-picker-inline"
            label="Datum nákupu"
            value={state.date}
            onChange={(date: MaterialUiPickersDate) => state.changeItem('date', date)}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </MuiPickersUtilsProvider>

        <TextValidator
          className={classes.textField}
          value={state.shop}
          onChange={(ev) => state.changeItem('shop', ev.target.value)}
          label="Obchod"
          name="Shop name"
          validators={['required']}
          errorMessages={['Toto pole je povinné']}
        />
        <TextValidator
          className={classes.textField}
          value={state.size}
          onChange={(ev) => state.changeItem('size', ev.target.value)}
          label="Velikost"
          name="Size"
          validators={['required']}
          errorMessages={['Toto pole je povinné']}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <span>{state.unit}</span>
              </InputAdornment>
            )
          }}
        />

        <FormControl className={classes.textField}>
          <InputLabel id="demo-simple-select-label">Jednotka</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={state.unit}
            onChange={(ev) => state.changeItem('unit', ev.target.value)}>
            <MenuItem value={'l'}>litr</MenuItem>
            <MenuItem value={'ml'}>mililitr</MenuItem>
            <MenuItem value={'g'}>gram</MenuItem>
            <MenuItem value={'kg'}>kilogram</MenuItem>
            <MenuItem value={'pc'}>kus</MenuItem>
          </Select>
        </FormControl>

        <TextField
          className={classes.textField}
          value={state.note}
          onChange={(ev) => state.changeItem('note', ev.target.value)}
          label="Poznámka"
          multiline
        />
      </ValidatorForm>
    </Box>
  );
}

const AddShopItem = observer(_AddShopItem);
export default AddShopItem;
