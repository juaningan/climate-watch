import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/search';
import ResultsList from 'components/results-list';
import Map from 'components/map';

import layout from 'styles/layout.scss';
import resultsListLightTheme from 'styles/themes/results-list-light.scss';
import searchLightTheme from 'styles/themes/search-light.scss';
import styles from './countries-select-styles.scss';

class CountriesSelect extends PureComponent {
  render() {
    const {
      query,
      paths,
      countrySelectFilter,
      countriesList,
      onCountryClick,
      computedStyles
    } = this.props;
    return (
      <div className={cx(layout.content, styles.wrapper)}>
        <Search
          placeholder=""
          value={query}
          onChange={countrySelectFilter}
          className={styles.search}
          theme={searchLightTheme}
        />
        <ResultsList
          list={countriesList}
          emptyDataMsg="No results"
          theme={resultsListLightTheme}
        />
        <Map
          cache={false}
          paths={paths}
          className={styles.map}
          onCountryClick={onCountryClick}
          computedStyles={computedStyles}
        />
      </div>
    );
  }
}

CountriesSelect.propTypes = {
  query: Proptypes.string,
  onCountryClick: Proptypes.func.isRequired,
  computedStyles: Proptypes.func.isRequired,
  countrySelectFilter: Proptypes.func.isRequired,
  countriesList: Proptypes.array,
  paths: Proptypes.array
};

export default CountriesSelect;
