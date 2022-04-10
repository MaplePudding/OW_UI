import { BaseAdapter, baseFoundation } from '../_base/baseFoundation';
import { DOMRectLikeType } from '../utils/dom';
import { basePrefix } from '../_base/base';

export const prefix = `${basePrefix}-tooltip`;

export type TriggerType = 'hover' | 'focus' | 'click'

export type PositionType = 'top' | 'right' | 'bottom' | 'left'

const defaultRect = {
  left: 0,
  top: 0,
  height: 0,
  width: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

export interface PopupContainerDOMRect extends DOMRectLikeType {
  scrollLeft?: number;
  scrollTop?: number;
}

export interface TooltipAdapter<
  P=Record<string, any>,
  S=Record<string, any>
  >extends BaseAdapter<P, S>{
  getEventNames: () => any
  bindEvent: (_triggerEventCollection:Record<string, any>) => any
  show: (_positionStyle: Record<string, number|string>) => any
  hide: () => any
  getTriggerRect: () => DOMRect
  getPopupContainerRect: () => PopupContainerDOMRect
  updatePosition: () => any
  containerIsRelativeOrAbsolute(): boolean;
  updateContainerPosition(): void;
  getContainerPosition(): string;
  registerScrollHandler(_arg: () => Record<string, any>):void
  unregisterScrollHandler():void;
  getWrapperBounding(..._args: any[]): DOMRect;
  registerClickOutsideHandler(..._args: any[]): void;
  unregisterClickOutsideHandler(..._args: any[]): void;
}

export class TooltipFoundation<
  P = Record<string, any>,
  S = Record<string, any>
  > extends baseFoundation<TooltipAdapter<P, S>, P, S> {
  constructor(adapter: TooltipAdapter<P, S>) {
    super({ ...adapter });
  }

  init() {
    const { triggerEventCollection } = this.generateEvent();
    this.bindEvent(triggerEventCollection);
    this._initContainerPosition();
  }

  generateEvent = () => {
    const trigger = this.getProp('trigger');
    const eventNames = this._adapter.getEventNames();
    const triggerEventCollection = {};
    switch (trigger) {
      case 'hover':
        triggerEventCollection[eventNames.mouseEnter] = this.show;
        triggerEventCollection[eventNames.mouseLeave] = this.hide;
        break;
      case 'click':
        triggerEventCollection[eventNames.click] = () => {
          this.show();
        };
        break;
      default:
        break;
    }
    return { triggerEventCollection };
  };

  bindEvent(triggerEventCollection:Record<string, any>) {
    this._adapter.bindEvent(triggerEventCollection);
  }

  // 抽离？
  static _roundPixel(pixel: number) {
    if (typeof pixel === 'number') {
      return `${Math.round(pixel)}px`;
    }

    return pixel;
  }

  static destroy = () => {

  };

  show = () => {
    const trigger = this.getProp('trigger');
    this._adapter.updateContainerPosition();
    const positionStyle = this.calcPosition();
    this._adapter.show(positionStyle);
    this._bindScrollEvent();

    if (trigger === 'click') {
      this._adapter.registerClickOutsideHandler(this.hide);
    }
  };

  hide = () => {
    this._adapter.hide();
    this._unBindScrollEvent();
  };

  containerIsRelativeOrAbsolute() {
    return this._adapter.containerIsRelativeOrAbsolute();
  }

  calcPosition() {
    const triggerRect = this.getTriggerRect();
    const containerRect = this.getContainerRect();
    const wrapperRect = this._adapter.getWrapperBounding()
      ? this._adapter.getWrapperBounding()
      : this._adapter.getWrapperBounding() || { ...defaultRect as any };
    const spacing = this.getProp('spacing');
    let position = this.getProp('position');
    let translateX = '0%';
    let translateY = '0%';

    const triggerMiddleX = triggerRect.left + triggerRect.width / 2;
    const triggerMiddleY = triggerRect.top + triggerRect.height / 2;

    let left = null;
    let top = null;

    if (this.getProp('autoAdjustOverflow')) {
      const { innerWidth, innerHeight } = window;
      const { spacing } = this.getProps();
      const clientLeft = triggerRect.left;
      const clientRight = triggerRect.right;
      const clientTop = triggerRect.top;

      const restClientRight = innerWidth - clientRight;
      const restClientBottom = innerHeight - clientTop;

      if (clientTop < wrapperRect.height + spacing && restClientBottom > wrapperRect.height + spacing && position === 'top') {
        position = 'bottom';
      } else if (clientLeft < wrapperRect.width + spacing && restClientRight > wrapperRect.width + spacing && position === 'left') {
        position = 'right';
      } else if (restClientBottom < wrapperRect.height + spacing && clientTop > wrapperRect.height + spacing && position === 'bottom') {
        position = 'top';
      } else if (restClientRight < wrapperRect.width + spacing && clientLeft > wrapperRect.width + spacing && position === 'right') {
        position = 'left';
      }
    }

    switch (position) {
      case 'top':
        left = triggerMiddleX;
        top = triggerRect.top - spacing;
        translateX = '-50%';
        translateY = '-100%';
        break;
      case 'right':
        left = triggerRect.left + spacing + triggerRect.width;
        top = triggerMiddleY;
        translateY = '-50%';
        break;
      case 'bottom':
        left = triggerMiddleX;
        top = triggerRect.top + spacing + triggerRect.height;
        translateX = '-50%';
        break;
      case 'left':
        left = triggerRect.left - spacing;
        top = triggerMiddleY;
        translateY = '-50%';
        translateX = '-100%';
        break;
      default:
        break;
    }

    if (this.containerIsRelativeOrAbsolute()) {
      left = left - containerRect.left + containerRect.scrollLeft;
      top = top - containerRect.top + containerRect.scrollTop;
    }
    const style: Record<string, string | number> = {
      left: TooltipFoundation._roundPixel(left),
      top: TooltipFoundation._roundPixel(top),
      transform: `translate(${translateX}, ${translateY})`,
      position: 'absolute',
    };
    return style;
  }

  getTriggerRect() {
    return this._adapter.getTriggerRect();
  }

  getContainerRect() {
    return this._adapter.getPopupContainerRect();
  }

  _initContainerPosition() {
    this._adapter.updateContainerPosition();
  }

  _bindScrollEvent() {
    this._adapter.registerScrollHandler(() => this.calcPosition());
  }

  _unBindScrollEvent() {
    this._adapter.unregisterScrollHandler();
  }
}
