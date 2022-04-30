import { action, observable } from 'mobx';
import { LoadingState } from '../../contexts/LoaderContext';

export default class Loader {
  @observable loadingState = LoadingState.Idle;
  @observable errorMessage = '';
  @observable timer = {} as any;

  @action.bound
  public startLoading() {
    if (this.loadingState !== LoadingState.Loading) {
      this.errorMessage = '';
      this.loadingState = LoadingState.Loading;
    }
  }

  @action.bound
  public finishedLoadingSucces() {
    if (this.loadingState !== LoadingState.Success) {
      this.errorMessage = '';
      this.loadingState = LoadingState.Success;
      const timerId = setTimeout(() => {
        this.loadingState = LoadingState.Idle;
        this.errorMessage = '';
      }, 1500);
      this.timer = timerId;
    }
  }

  @action.bound
  public finishedLoadingError(error: string | Error) {
    if (this.loadingState !== LoadingState.Error) {
      this.errorMessage = typeof error === 'object' && 'message' in error ? error.message : error;
      this.loadingState = LoadingState.Error;
      const timerId = setTimeout(() => {
        this.loadingState = LoadingState.Idle;
        this.errorMessage = '';
      }, 2000);
      this.timer = timerId;
    }
  }
}
