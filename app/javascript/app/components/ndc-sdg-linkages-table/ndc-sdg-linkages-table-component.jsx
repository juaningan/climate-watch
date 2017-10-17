import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import SDGCard from 'components/sdg-card';
import NdcSdgLinkagesList from 'components/ndc-sdg-linkages-list';
import Loading from 'components/loading';

import cardTheme from 'styles/themes/sdg-card/sdg-card';
import styles from './ndc-sdg-linkages-table-styles.scss';

class NdcSdgLinkagesTable extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      goals,
      selectedGoal,
      handleClickGoal,
      handleClickClose
    } = this.props;
    if (!goals || !goals.length) return <Loading />;
    return (
      <div>
        {selectedGoal ? (
          <NdcSdgLinkagesList
            onCloseClick={handleClickClose}
            goal={selectedGoal}
          />
        ) : (
          <div className={styles.container}>
            {goals.map((goal, i) => {
              const isSelected = selectedGoal
                ? goal.id === selectedGoal.id
                : i === 0;

              return (
                <SDGCard
                  square
                  hover
                  selected={isSelected}
                  onClick={() => handleClickGoal(goal.number)}
                  key={goal.title}
                  sdgData={goal}
                  tooltipId="sdg-linkages"
                  className={cx(cardTheme.card, cardTheme.squaredCard)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

NdcSdgLinkagesTable.propTypes = {
  goals: PropTypes.array,
  handleClickGoal: PropTypes.func.isRequired,
  handleClickClose: PropTypes.func.isRequired,
  selectedGoal: PropTypes.object
};

export default NdcSdgLinkagesTable;