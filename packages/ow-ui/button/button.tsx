/* eslint-disable react/jsx-props-no-spreading */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { noop } from '@maplex/ow-foundation/_base/func';
import {
  btnType, htmlType, size, iconPosition, prefix,
} from '@maplex/ow-foundation/button/button';
import classNames from 'classnames';
import '@maplex/ow-foundation/button/button.css';

interface ButtonProps{
  children?: React.ReactText,
  block?: boolean,
  type?: btnType,
  htmlType?: htmlType,
  disabled?: boolean,
  size?: size,
  icon?: React.ReactNode,
  iconPosition?: iconPosition,
  loading?: boolean,
  style?: React.CSSProperties,
  className?:string,
  id?:string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>,
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>,
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>,
}

function Button(props:ButtonProps) {
  const {
    children,
    block,
    type,
    htmlType,
    disabled,
    size,
    className,
    onClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    ...attr
  } = props;

  const baseProps = {
    disabled,
    ...attr,
    className: classNames(
      prefix,
      {
        [`${prefix}-${type}`]: !disabled,
        [`${prefix}-disabled`]: disabled,
        [`${prefix}-${size}`]: !block,
        [`${prefix}-block`]: block,
      },
      className,
    ),
    type: htmlType,
  };

  return (
    <button
      {...baseProps}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      onMouseEnter={(e) => { e.stopPropagation(); onMouseEnter(e); }}
      onMouseLeave={(e) => { e.stopPropagation(); onMouseLeave(e); }}
      onMouseDown={(e) => onMouseDown(e)}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  block: PropTypes.bool,
  type: PropTypes.string,
  htmlType: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.object),
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  block: false,
  type: 'primary',
  htmlType: 'button',
  disabled: false,
  className: null,
  id: null,
  style: null,
  size: 'default',
  icon: null,
  iconPosition: 'left',
  loading: false,
  onClick: noop,
  onMouseDown: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
};

export default Button;
