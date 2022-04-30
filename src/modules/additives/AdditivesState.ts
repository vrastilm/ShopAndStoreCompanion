import { action, observable } from 'mobx';
import additivesJson from './res/additivesCz.json';

export class Additive {
  public code = '';
  public name = '';
  public danger = 0;

  public constructor(code: string, name: string, danger: number) {
    this.name = name;
    this.code = code;
    this.danger = danger;
  }
}

export default class AdditiveState {
  @observable public additivesArr = [] as Array<Additive>;
  @observable public additivesArrShown = [] as Array<Additive>;
  @observable public filter = '';
  @observable public nShown = 10;
  private timeoutId = {} as any;

  public async load() {
    this.additivesArr = [];
    this.additivesArrShown = [];
    additivesJson.forEach((additive) => {
      this.additivesArr.push(
        new Additive(
          additive['kod'].toString(),
          additive['nazev'].toString(),
          parseInt(additive['skodlivost'] as any)
        )
      );
    });
    this.additivesArr = [...this.additivesArr];
    this.additivesArrShown = [...this.additivesArr.slice(0, this.nShown)];
  }

  @action.bound
  public setFilter(filter: string): void {
    this.filter = filter;

    globalThis.clearTimeout(this.timeoutId);
    this.timeoutId = globalThis.setTimeout(() => {
      if (this.filter === '') {
        this.additivesArrShown = this.additivesArr.slice(0, this.nShown);
      } else {
        this.additivesArrShown = [
          ...this.additivesArr.filter(
            (item) =>
              item.code.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()) ||
              item.name.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()) ||
              item.danger.toString().includes(this.filter.toLocaleLowerCase())
          )
        ];
      }
    }, 750);
  }

  @action.bound
  public loadMore() {
    this.nShown += 10;
    this.additivesArrShown = [...this.additivesArr.slice(0, this.nShown)];
  }
}
