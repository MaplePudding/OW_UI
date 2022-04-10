/* eslint-disable */

export interface BaseAdapter<P = Record<string, any>, S = Record<string, any>>{
  getProp(key:string):any;
  getProps():any;
  getState(key:string):any,
  getStates():any;
  setState(s:Pick<S, keyof S>, callback?: any):any;
}

export class baseFoundation<A extends BaseAdapter<P, S>, P = Record<string, any>, S = Record<string, any>> {
  _adapter!:A;

  constructor(adapter: A) {
    this._adapter = { ...adapter };
  }

  getProp(key:string) {
    return this._adapter.getProp(key);
  }

  getProps() {
    return this._adapter.getProps();
  }

  getState(key:string) {
    return this._adapter.getState(key);
  }

  getStates() {
    return this._adapter.getStates();
  }

  setState(states: S, cb?: (...args: any) => void) {
    return this._adapter.setState({ ...states }, cb);
  }
}
