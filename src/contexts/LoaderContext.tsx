import { observer } from 'mobx-react';
import * as React from 'react';
import Loader from '../modules/global/LoaderState';

export enum LoadingState {
  Loading,
  Success,
  Error,
  Idle
}

const LoadingContext = React.createContext({} as Loader);

const LoadingContextProvider = function (props: any) {
  const [loader] = React.useState(new Loader());
  return <LoadingContext.Provider value={loader}>{props.children}</LoadingContext.Provider>;
};

export default observer(LoadingContextProvider);
export { LoadingContext };
