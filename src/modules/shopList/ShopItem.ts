import IShopItem from './interfaces/IShopItem';
import ItemSpecie from './interfaces/ItemSpecie';
import Shop from './interfaces/Shop';
import Unit from './interfaces/Unit';
import db from '../../database/indexedDb';
import { DateTime } from 'luxon';

export default class ShopItem implements IShopItem {
  id: string;
  name: string;
  specie: ItemSpecie;
  price: string;
  date: DateTime;
  shop: Shop;
  size: number;
  unit: Unit;
  note: string;

  public constructor(
    id: string,
    name: string,
    specie: ItemSpecie,
    price: string,
    date: DateTime,
    shop: Shop,
    size: number,
    unit: Unit,
    note: string
  ) {
    this.id = id;
    this.name = name;
    this.specie = specie;
    this.price = price;
    this.date = date;
    this.shop = shop;
    this.size = size;
    this.unit = unit;
    this.note = note;
  }

  public async saveToDb(update = false): Promise<void> {
    if (update) {
      await db.table('ShopItem').update(this.id, {
        id: this.id,
        name: this.name,
        specie: this.specie.name,
        price: this.price,
        date: this.date.toString(),
        shop: this.shop,
        size: this.size,
        unit: this.unit,
        note: this.note
      });
    } else {
      await db.table('ShopItem').add({
        id: this.id,
        name: this.name,
        specie: this.specie.name,
        price: this.price,
        date: this.date.toString(),
        shop: this.shop,
        size: this.size,
        unit: this.unit,
        note: this.note
      });
    }
  }
}
