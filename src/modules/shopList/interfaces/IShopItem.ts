import Shop from './Shop';
import ItemSpecie from './ItemSpecie';
import Unit from './Unit';
import { DateTime } from 'luxon';

export default interface IShopItem {
  id: string;
  name: string;
  specie: ItemSpecie;
  price: string;
  date: DateTime;
  shop: Shop;
  size: number;
  unit: Unit;
  note: string;
}
