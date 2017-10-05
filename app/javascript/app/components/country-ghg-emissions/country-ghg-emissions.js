import { createElement, PureComponent } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getLocationParamUpdated } from 'utils/navigation';
import qs from 'query-string';

import {
  getSourceOptions,
  getSourceSelected,
  getChartData,
  getChartConfig,
  getSelectorDefaults
} from './country-ghg-emissions-selectors';

import CountryGhgEmissionsComponent from './country-ghg-emissions-component';
import actions from './country-ghg-emissions-actions';

const mapStateToProps = (state, { location, match }) => {
  const { meta, data } = state.countryGhgEmissions;
  const search = qs.parse(location.search);
  const countryGhg = {
    meta,
    data,
    search
  };
  return {
    iso: match.params.iso,
    data: getChartData(countryGhg),
    sources: getSourceOptions(countryGhg),
    sourceSelected: getSourceSelected(countryGhg),
    config: getChartConfig(countryGhg),
    selectorDefaults: getSelectorDefaults(countryGhg)
  };
};

function needsRequestData(props, nextProps) {
  const { sourceSelected } = nextProps;
  const hasValues = sourceSelected.value;
  const hasChanged = sourceSelected.value !== props.sourceSelected.value;
  return hasValues && hasChanged;
}

function getFiltersParsed(props) {
  const { sourceSelected, selectorDefaults } = props;
  const filter = {};
  filter.location = props.iso;
  filter.gas = selectorDefaults.gas;
  filter.source = sourceSelected
    ? sourceSelected.value
    : selectorDefaults.source;
  return filter;
}

class CountryGhgEmissionsContainer extends PureComponent {
  componentDidMount() {
    const { fetchCountryGhgEmissionsMeta } = this.props;
    fetchCountryGhgEmissionsMeta();
  }

  componentWillReceiveProps(nextProps) {
    if (needsRequestData(this.props, nextProps)) {
      const { fetchCountryGhgEmissionsData } = nextProps;
      const filters = getFiltersParsed(nextProps);
      fetchCountryGhgEmissionsData(filters);
    }
  }

  handleSourceChange = category => {
    this.updateUrlParam({ name: 'source', value: category.value }, true);
  };

  updateUrlParam(params, clear) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, params, clear));
  }

  render() {
    return createElement(CountryGhgEmissionsComponent, {
      ...this.props,
      handleSourceChange: this.handleSourceChange
    });
  }
}

CountryGhgEmissionsContainer.propTypes = {
  history: Proptypes.object,
  location: Proptypes.object,
  fetchCountryGhgEmissionsMeta: Proptypes.func,
  fetchCountryGhgEmissionsData: Proptypes.func
};

export { default as component } from './country-ghg-emissions-component';
export { initialState } from './country-ghg-emissions-reducers';
export { default as reducers } from './country-ghg-emissions-reducers';
export { default as styles } from './country-ghg-emissions-styles';
export { default as actions } from './country-ghg-emissions-actions';

export default withRouter(
  connect(mapStateToProps, actions)(CountryGhgEmissionsContainer)
);
