import { Component } from 'react';
import * as React from 'react';
import { BaseAdapter } from '@maplex/ow-foundation/_base/baseFoundation';

export interface BaseProps{
  className:string,
  style: React.CSSProperties
}

export default class BaseComponent<P extends BaseProps, S = {}> extends Component<P, S> {
  /* eslint-disable */
  _foundation;

  constructor(props: P) {
    super(props);
    this._foundation = null;
  }

  /* eslint-disable */
  get adapter():BaseAdapter {
    return {
      getProp: (key:string) => this.props[key],
      getProps: () => this.props,
      getState: (key:string) => this.state[key],
      getStates: () => this.state,
      // @ts-ignore
      setState: (states, cb) => this.setState({ ...states }, cb),
    };
  }
}
