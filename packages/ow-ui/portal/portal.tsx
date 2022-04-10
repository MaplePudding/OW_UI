import { PureComponent } from 'react';
import * as PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import * as React from 'react';
import '@maplex/ow-foundation/button/button.css';

export interface PortalProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  getPopupContainer?: () => HTMLElement;
  didUpdate?: (_props: PortalProps) => void;
}

export interface PortalState {
  container: undefined | HTMLElement;
}

class Portal extends PureComponent<PortalProps, PortalState> {
  /* eslint-disable */
  static defaultProps = {
    style: null,
    className: null,
    children: null,
    getPopupContainer: () => document.body,
  };
  /* eslint-disable */
  static propTypes = {
    children: PropTypes.node,
    prefixCls: PropTypes.string,
    getPopupContainer: PropTypes.func,
    className: PropTypes.string,
    didUpdate: PropTypes.func,
  };

  el: HTMLElement;

  constructor(props: PortalProps) {
    super(props);
    try {
      this.el = document.createElement('div');
    } catch (e) {
    }
    this.state = {
      container: undefined,
    };
  }

  componentDidMount() {
    if (!this.el) {
      this.el = document.createElement('div');
    }
    const { state, props } = this;
    const container = this.props.getPopupContainer();
    if (container !== state.container) {
      container.appendChild(this.el);
      this.addStyle(props.style);
      this.addClass('ow-portal', props.className);
      this.setState({ container });
    }
  }

  componentDidUpdate(prevProps: PortalProps) {
    const { didUpdate } = this.props;
    if (didUpdate) {
      didUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    const { container } = this.state;
    if (container) {
      container.removeChild(this.el);
    }
  }

  addStyle = (style = {}) => {
    if (this.el) {
      for (const key of Object.keys(style)) {
        this.el.style[key] = style[key];
      }
    }
  };

  addClass = (prefixCls: string, ...classnames: string[]) => {
    const { direction } = this.context;
    const cls = classNames(prefixCls, ...classnames);
    if (this.el) {
      this.el.className = cls;
    }
  };

  render() {
    const { state, props } = this;
    if (state.container) {
      return createPortal(props.children, this.el);
    }
    return null;
  }
}

export default Portal;
