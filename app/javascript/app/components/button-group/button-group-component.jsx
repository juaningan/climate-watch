import React from 'react';
import Button from 'components/button';
import Icon from 'components/icon';
import cx from 'classnames';

import iconInfo from 'assets/icons/info.svg';
import iconShare from 'assets/icons/share.svg';
import iconDownload from 'assets/icons/download.svg';
import iconAddToUser from 'assets/icons/add-to-user.svg';
import PropTypes from 'prop-types';

import styles from './button-group-styles.scss';

const ButtonGroup = ({ className, onInfoClick }) => (
  <div className={cx(styles.buttonGroup, className)}>
    <Button className={cx(styles.button, styles.first)} onClick={onInfoClick}>
      <Icon icon={iconInfo} />
    </Button>
    <Button className={styles.button}>
      <Icon icon={iconShare} />
    </Button>
    <Button className={styles.button}>
      <Icon icon={iconDownload} />
    </Button>
    <Button className={cx(styles.button, styles.last)}>
      <Icon icon={iconAddToUser} />
    </Button>
  </div>
);

ButtonGroup.propTypes = {
  className: PropTypes.string,
  onInfoClick: PropTypes.func
};

export default ButtonGroup;
