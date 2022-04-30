import { DateTime } from 'luxon';
import { action, observable } from 'mobx';
import db, { assingOnChangeHandler } from '../../database/indexedDb';
import ShopItem from '../shopList/ShopItem';
import IShopItem from '../shopList/interfaces/IShopItem';

class HomeState {
  @observable public shopItemsShown: Array<IShopItem> = [];
  @observable public shopItemsFilteredShown: Array<IShopItem> = [];
  @observable public shopItems: Array<IShopItem> = [];
  @observable public isAdding = false;
  @observable public isLoaded = false;
  @observable public filter = '';
  @observable public selectedItem?: IShopItem;
  @observable public currentPage = 1;
  @observable public pageCount = 1;
  @observable public criterion = 'price';
  @observable public filterCriterion = 'name';

  private timeoutId = {} as any;
  private nForPage = 5;

  @action.bound
  public setFilterCriterion(fCriterion: string): void {
    this.filterCriterion = fCriterion;
  }

  @action.bound
  public getItemFilterProp(item: IShopItem): string {
    if (this.filterCriterion === 'shop') {
      return item[this.filterCriterion]['name'];
    }

    return item[this.filterCriterion];
  }

  private async loadFromDb() {
    this.shopItems = [];
    this.shopItemsShown = [];
    this.shopItemsFilteredShown = [];
    const shopItemsDb = await db.table('ShopItem').toArray();
    shopItemsDb.forEach((shopItem) => {
      this.shopItems.push(
        new ShopItem(
          shopItem.id,
          shopItem.name,
          shopItem.specie,
          shopItem.price,
          DateTime.fromISO(shopItem.date),
          shopItem.shop,
          shopItem.size,
          shopItem.unit,
          shopItem.note
        )
      );
    });

    if (this.filter === '') {
      this.currentPage = 1;
      this.pageCount =
        Math.round(this.shopItems.length / this.nForPage) == 0
          ? 1
          : Math.round(this.shopItems.length / this.nForPage);
      this.shopItemsShown = this.shopItems;
      this.shopItemsFilteredShown = this.shopItems;
      this.shopItemsShown = [
        ...this.shopItems.slice(this.getStartIdx(), this.getEndIdx(this.shopItems))
      ];
      this.isLoaded = true;
    } else {
      this.currentPage = 1;
      this.shopItemsShown = this.shopItems;
      this.shopItemsFilteredShown = this.shopItems;
      this.shopItemsFilteredShown = this.shopItems
        .filter((item) =>
          this.getItemFilterProp(item).toLocaleLowerCase().includes(this.filter.toLocaleLowerCase())
        )
        .sort(this.sortByPrice.bind(this));
      this.pageCount =
        Math.round(this.shopItemsFilteredShown.length / this.nForPage) == 0
          ? 1
          : Math.round(this.shopItemsFilteredShown.length / this.nForPage);
      this.shopItemsShown = [
        ...this.shopItemsFilteredShown.slice(
          this.getStartIdx(),
          this.getEndIdx(this.shopItemsFilteredShown)
        )
      ];
      this.isLoaded = true;
    }
  }

  @action.bound
  async load(): Promise<void> {
    await this.loadFromDb();
    assingOnChangeHandler(this.loadFromDb.bind(this));
  }

  @action.bound
  toggleAdding(): void {
    this.isAdding = !this.isAdding;
  }

  @action.bound
  public async removeItem(item: IShopItem): Promise<void> {
    await db.table('ShopItem').delete(item.id);
  }

  @action.bound
  public setFilter(filter: string): void {
    this.filter = filter;

    globalThis.clearTimeout(this.timeoutId);
    this.timeoutId = globalThis.setTimeout(() => {
      if (this.filter === '') {
        this.currentPage = 1;
        this.pageCount =
          Math.round(this.shopItems.length / this.nForPage) == 0
            ? 1
            : Math.round(this.shopItems.length / this.nForPage);
        this.shopItemsShown = [
          ...this.shopItems.slice(this.getStartIdx(), this.getEndIdx(this.shopItems))
        ];
      } else {
        this.currentPage = 1;
        this.shopItemsFilteredShown = this.shopItems
          .filter((item) =>
            this.getItemFilterProp(item)
              .toLocaleLowerCase()
              .includes(this.filter.toLocaleLowerCase())
          )
          .sort(this.sortByPrice.bind(this));
        this.pageCount =
          Math.round(this.shopItemsFilteredShown.length / this.nForPage) == 0
            ? 1
            : Math.round(this.shopItemsFilteredShown.length / this.nForPage);
        this.shopItemsShown = [
          ...this.shopItemsFilteredShown.slice(
            this.getStartIdx(),
            this.getEndIdx(this.shopItemsFilteredShown)
          )
        ];
      }
    }, 750);
  }

  @action.bound
  public setPage(page: number): void {
    this.currentPage = page;

    if (this.filter === '') {
      this.shopItemsShown = [
        ...this.shopItems.slice(this.getStartIdx(), this.getEndIdx(this.shopItems))
      ];
    } else {
      this.shopItemsShown = [
        ...this.shopItemsFilteredShown.slice(
          this.getStartIdx(),
          this.getEndIdx(this.shopItemsFilteredShown)
        )
      ];
    }
  }

  private sortByPrice(a: IShopItem, b: IShopItem): number {
    if (!a || !b) {
      return 0;
    }

    const priceA = parseInt(a[this.criterion]);
    const priceB = parseInt(b[this.criterion]);

    if (isNaN(priceA)) {
      return -1;
    }

    if (isNaN(priceA) && isNaN(priceB)) {
      return a.price.localeCompare(b.price, undefined, { numeric: true });
    }

    if (isNaN(priceB)) {
      return -1;
    }

    if (priceA < priceB) {
      return -1;
    }
    if (priceA > priceB) {
      return 1;
    }

    return 0;
  }

  private getStartIdx(): number {
    return this.nForPage * (this.currentPage - 1);
  }

  private getEndIdx(displayedArr: Array<IShopItem>): number {
    let endIdx = this.nForPage * this.currentPage - 1 + this.nForPage;
    return endIdx > displayedArr.length
      ? displayedArr.length - 1 < 0
        ? 0
        : displayedArr.length
      : endIdx;
  }
}

export default HomeState;
