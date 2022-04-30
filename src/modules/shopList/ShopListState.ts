import { action, observable } from 'mobx';
import { DateTime } from 'luxon';
import ShopItem from './ShopItem';
import { v4 as uuidv4 } from 'uuid';
import IShopItem from './interfaces/IShopItem';

const dateFormat = 'dd/MM/yyyy';
export { dateFormat };

export default class ShopListState {
  [propName: string]: any;
  @observable name = '';
  @observable specie = '';
  @observable price = '';
  @observable date = DateTime.local();
  @observable shop = '';
  @observable size = '';
  @observable unit = 'l';
  @observable note = '';
  @observable isLoading = false;

  private uuid?: string;

  @action.bound
  public loadItem(item: IShopItem) {
    if (item) {
      this.uuid = item.id;
      this.name = item.name;
      this.specie = item.specie.name;
      this.price = item.price;
      this.date = item.date;
      this.shop = item.shop.name;
      this.size = item.size.toString();
      this.unit = item.unit.name;
      this.note = item.note;
    }
  }

  @action.bound
  public async saveItem(): Promise<void> {
    this.isLoading = true;
    if (!this.uuid) {
      const shopItem = new ShopItem(
        uuidv4(),
        this.name,
        { name: this.specie },
        this.price,
        this.date,
        { name: this.shop },
        parseFloat(this.size),
        { name: this.unit },
        this.note
      );
      await shopItem.saveToDb();
    } else {
      const shopItem = new ShopItem(
        this.uuid,
        this.name,
        { name: this.specie },
        this.price,
        this.date,
        { name: this.shop },
        parseFloat(this.size),
        { name: this.unit },
        this.note
      );
      await shopItem.saveToDb(true);
    }

    this.clear();
  }

  @action.bound
  public changeItem(propertyName: string, value: any): void {
    this[propertyName] = value;
  }

  @action
  public clear(): void {
    this.name = '';
    this.specie = '';
    this.price = '';
    this.date = DateTime.local();
    this.shop = '';
    this.size = '';
    this.unit = '';
    this.note = '';
    this.uuid = void 0;
  }
}
