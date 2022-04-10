import * as PropTypes from 'prop-types';
import {
  PopupContainerDOMRect,
  PositionType,
  TooltipAdapter,
  TooltipFoundation,
  TriggerType,
  prefix,
} from '@maplex/ow-foundation/tooltip/tooltip';
import '@maplex/ow-foundation/tooltip/tooltip.css';
import { get, throttle } from 'lodash';
import React from 'react';
import isHTMLElement, { convertDOMRectToObject } from '@maplex/ow-foundation/utils/dom';
import classNames from 'classnames';
import Portal from '../portal/portal';
import BaseComponent, { BaseProps } from '../_base/baseComponent';

export interface TooltipProps extends BaseProps{
  children: React.ReactNode,
  content: React.ReactNode,
  trigger: TriggerType,
  position: PositionType,
  getPopupContainer: () => HTMLElement,
  spacing: number,
  autoAdjustOverflow: boolean
}

export interface TooltipState{
  inserted: boolean
  triggerEventCollection: Record<string, any>
  portalPosition: Record<string, number|string>
}

export default class Tooltip extends BaseComponent<TooltipProps, TooltipState> {
  triggerEl: React.RefObject<unknown>;

  containerEl: React.RefObject<unknown>;

  clickOutsideHandler: any;

  containerPosition: string;

  scrollHandler: any;

  mounted: boolean;

  setContainerEl = (node: HTMLDivElement) => { (this.containerEl = { current: node }); };

  static defaultProps = {
    children: null,
    content: null,
    trigger: 'hover',
    getPopupContainer: () => document.body,
    spacing: 10,
    autoAdjustOverflow: true,
  };

  static propTypes = {
    trigger: PropTypes.string,
  };

  constructor(props: TooltipProps) {
    super(props);
    this.state = {
      inserted: false,
      triggerEventCollection: {},
      portalPosition: {
        left: 0,
        top: 0,
      },
    };
    this._foundation = new TooltipFoundation(this.adapter);
    this.triggerEl = React.createRef();
    this.containerEl = React.createRef();
    this.containerPosition = undefined;
  }

  get adapter():TooltipAdapter {
    return {
      ...super.adapter,
      getEventNames: () => ({
        click: 'onClick',
        mouseEnter: 'onMouseEnter',
        mouseLeave: 'onMouseLeave',
        focus: 'onFocus',
        blur: 'onBlur',
      }),

      getTriggerRect: () => {
        const triggerDOM = this.triggerEl.current;
        return triggerDOM && (triggerDOM as Element).getBoundingClientRect();
      },

      bindEvent: (triggerEventCollection) => {
        this.setState({ triggerEventCollection });
      },
      show: (positionStyle: Record<string, number|string>) => {
        this.setState({ inserted: true });
        this.setState({ portalPosition: positionStyle });
      },
      hide: () => {
        this.setState({ inserted: false });
      },
      updatePosition: () => {

      },
      getPopupContainerRect: () => {
        const container = this.props.getPopupContainer();
        let rect: PopupContainerDOMRect = null;
        if (container && isHTMLElement(container)) {
          const boundingRect = convertDOMRectToObject(container.getBoundingClientRect());
          rect = {
            ...boundingRect,
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop,
          };
        }
        return rect;
      },
      containerIsRelativeOrAbsolute: () => ['relative', 'absolute'].includes(this.containerPosition),
      updateContainerPosition: () => {
        const container = this.props.getPopupContainer();
        if (container && isHTMLElement(container)) {
          const computedStyle = window.getComputedStyle(container);
          const position = computedStyle.getPropertyValue('position');
          this.containerPosition = position;
        }
      },
      getContainerPosition: () => this.containerPosition,
      registerScrollHandler(rePositionCb: (_arg: { x: number; y: number }) => void) {
        if (this.scrollHandler) {
          this.unregisterScrollHandler();
        }
        this.scrollHandler = throttle((e):any => {
          if (!this.mounted) {
            return false;
          }
          const triggerDOM = this.triggerEl.current;
          const isRelativeScroll = e.target.contains(triggerDOM);
          if (isRelativeScroll) {
            const scrollPos = { x: e.target.scrollLeft, y: e.target.scrollTop };
            rePositionCb(scrollPos);
          }
          return null;
        }, 10);
        window.addEventListener('scroll', this.scrollHandler, true);
      },
      unregisterScrollHandler() {
      },
      getWrapperBounding: () => {
        const el = this.containerEl && this.containerEl.current;
        return el && (el as Element).getBoundingClientRect();
      },
      registerClickOutsideHandler: (cb: () => void) => {
        if (this.clickOutsideHandler) {
          this.adapter.unregisterClickOutsideHandler();
        }
        this.clickOutsideHandler = (e: React.MouseEvent): any => {
          if (!this.mounted) {
            return false;
          }
          const el = this.triggerEl && this.triggerEl.current;
          const popupEl = this.containerEl && this.containerEl.current;
          if (
            (el && !(el as any).contains(e.target)
              && popupEl
              && !(popupEl as any).contains(e.target))
          ) {
            cb();
          }
          return null;
        };
        document.addEventListener('click', this.clickOutsideHandler, false);
      },
      unregisterClickOutsideHandler: () => {
        if (this.clickOutsideHandler) {
          document.removeEventListener('click', this.clickOutsideHandler, false);
          this.clickOutsideHandler = null;
        }
      },
    };
  }

  componentDidMount() {
    /* eslint-disable */
    this._foundation && typeof this._foundation.init === 'function' && this._foundation.init();
    this.mounted = true;
  }

  componentWillUnmount() {
    /* eslint-disable */
    this._foundation && typeof this._foundation.destroy === 'function' && this._foundation.destroy();
    this.mounted = false;
  }

  renderPortal() {
    return (
      <Portal getPopupContainer={this.props.getPopupContainer} style={this.state.portalPosition}>
        {/* eslint-disable */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div
          className={`ow-portal-inner ${prefix}-portal`}
          ref={this.setContainerEl}
        >
          {this.props.content}
        </div>
      </Portal>
    );
  }
  /* eslint-disable */
  mergeChildEvents(props = {}, coll = {}) {
    const _props = { ...props };
    const _coll = { ...coll };
    const mergedEvents = {};
    for (const key in _props) {
      if (_props.hasOwnProperty(key) && _coll.hasOwnProperty(key) && typeof _props[key] === 'function') {
        mergedEvents[key] = () => {
          props[key]();
          coll[key]();
        };
        delete _coll[key];
      }
    }
    return Object.assign(mergedEvents, _coll);
  }

  render() {
    const { children } = this.props;
    const { triggerEventCollection } = this.state;

    const newElement = React.cloneElement(children as React.ReactElement, {
      ...(children as React.ReactElement).props,
      ...this.mergeChildEvents((children as React.ReactElement).props, triggerEventCollection),
      ref: (node: React.ReactNode) => {
        (this.triggerEl as any).current = node;
        const { ref } = children as any;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          ref.current = node;
        }
      },
      className: classNames(
        get(children as Object, 'props.className'),
        `${prefix}`,
      ),
    });

    return (
      <>
        {this.state.inserted ? this.renderPortal() : null}
        {newElement}
      </>
    );
  }
}
