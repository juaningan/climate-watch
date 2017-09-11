import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import cx from 'classnames';

import sdg1 from 'assets/sdg-icons/icon_1';
import sdg2 from 'assets/sdg-icons/icon_2';
import sdg3 from 'assets/sdg-icons/icon_3';
import sdg4 from 'assets/sdg-icons/icon_4';
import sdg5 from 'assets/sdg-icons/icon_5';
import sdg6 from 'assets/sdg-icons/icon_6';
import sdg7 from 'assets/sdg-icons/icon_7';
import sdg8 from 'assets/sdg-icons/icon_8';
import sdg9 from 'assets/sdg-icons/icon_9';
import sdg10 from 'assets/sdg-icons/icon_10';
import sdg11 from 'assets/sdg-icons/icon_11';
import sdg12 from 'assets/sdg-icons/icon_12';
import sdg13 from 'assets/sdg-icons/icon_13';
import sdg14 from 'assets/sdg-icons/icon_14';
import sdg15 from 'assets/sdg-icons/icon_15';
import sdg16 from 'assets/sdg-icons/icon_16';
import sdg17 from 'assets/sdg-icons/icon_17';

import styles from './sdg-card-styles.scss';

const icons = {
  sdg1,
  sdg2,
  sdg3,
  sdg4,
  sdg5,
  sdg6,
  sdg7,
  sdg8,
  sdg9,
  sdg10,
  sdg11,
  sdg12,
  sdg13,
  sdg14,
  sdg15,
  sdg16,
  sdg17
};

class SDGCard extends PureComponent {
  render() {
    const { sdgIndex, sdgData, indicators, square } = this.props;
    const cardStyle = cx(styles.card, square ? styles.square : null);
    return (
      <div className={cardStyle}>
        <h4 className={styles.title}>{`${indicators
          ? sdgIndex
          : ''} ${sdgData.title}`}</h4>
        <div className={styles.dots}>
          {indicators &&
            sdgData &&
            Object.keys(sdgData.targets).map(target => (
              <span
                key={target}
                data-tip={sdgData.targets[target].title}
                className={styles.dot}
                style={{
                  backgroundColor: sdgData.targets[target].sectors
                    ? sdgData.colour
                    : ''
                }}
              />
            ))}
        </div>
        {!indicators && <div className={styles.number}>{sdgIndex}</div>}
        <div
          className={styles.icon}
          style={{ backgroundImage: `url(${icons[`sdg${sdgIndex}`]})` }}
        />
      </div>
    );
  }
}

SDGCard.propTypes = {
  sdgIndex: Proptypes.string,
  sdgData: Proptypes.object,
  indicators: Proptypes.bool,
  square: Proptypes.bool
};

export default SDGCard;