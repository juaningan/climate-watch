import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './button-styles.scss';

const Button = props => {
  const {
    link,
    children,
    className,
    square,
    color,
    disabled,
    onClick,
    noSpace
  } = props;
  const classNames = cx(className, styles.button, {
    [styles.square]: square,
    [styles.transparent]: color === 'transparent',
    [styles.yellow]: color === 'yellow',
    [styles.white]: color === 'white',
    [styles.plain]: color === 'plain',
    [styles.disabled]: !onClick && !link,
    [styles.noSpace]: noSpace
  });
  const isDisabled = disabled || !onClick;
  return link ? (
    <NavLink className={classNames} to={link}>
      {children}
    </NavLink>
  ) : (
    <button
      title={isDisabled ? 'Coming soon' : ''}
      disabled={isDisabled}
      className={classNames}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.string,
  square: PropTypes.bool,
  color: PropTypes.string,
  noSpace: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

Button.defaultProps = {
  noSpace: false,
  disabled: false
};

export default Button;
