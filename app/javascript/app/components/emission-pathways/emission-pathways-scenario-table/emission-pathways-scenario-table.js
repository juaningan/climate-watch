import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { getLocationParamUpdated } from 'utils/navigation';
import qs from 'query-string';
import {
  filterDataByBlackList,
  defaultColumns,
  ellipsisColumns,
  getCategories,
  getLocationOptions,
  getSelectedCategoryOption,
  getSelectedLocationOption,
  titleLinks
} from './emission-pathways-scenario-table-selectors';
import Component from './emission-pathways-scenario-table-component';

const mapStateToProps = (state, { category, match, location }) => {
  const search = qs.parse(location.search);

  const { id } = match.params;
  const espScenariosData = state.espScenarios && state.espScenarios.data;
  const espIndicatorsData = state.espIndicators && state.espIndicators.data;
  const espLocationsData = state.espLocations && state.espLocations.data;
  const espAvailableLocationsData =
    state.espLocations &&
    state.espLocations.scenarios &&
    state.espLocations.scenarios[id];
  const espTrendData =
    state.espIndicatorsTrend && state.espIndicatorsTrend.data;
  const providers = [
    'espScenarios',
    'espIndicators',
    'espLocations',
    'espIndicatorsTrend'
  ];
  const EspData = {
    categorySelected: search.category,
    locationSelected: search.location,
    query: search.search,
    espScenariosData,
    espIndicatorsData,
    espLocationsData,
    espAvailableLocationsData,
    espTrendData,
    category,
    id
  };

  return {
    data: filterDataByBlackList(EspData),
    defaultColumns: defaultColumns(EspData),
    ellipsisColumns,
    categories: getCategories(EspData),
    locations: getLocationOptions(EspData),
    selectedCategory: getSelectedCategoryOption(EspData),
    selectedLocation: getSelectedLocationOption(EspData),
    query: search.search,
    titleLinks: titleLinks(EspData),
    loading:
      state.espScenarios.loading ||
      state.espIndicators.loading ||
      state.espIndicatorsTrend.loading,
    id,
    error: providers.some(p => state[p].error)
  };
};

class EmissionPathwaysScenarioTableComponent extends PureComponent {
  handleSearchChange = query => {
    this.updateUrlParam({ name: 'search', value: query });
  };

  handleLocationChange = location => {
    this.updateUrlParam({
      name: 'location',
      value: location && location.value
    });
  };

  handleCategoryChange = category => {
    this.updateUrlParam({
      name: 'category',
      value: category && category.value
    });
  };

  updateUrlParam(param) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, param));
  }

  render() {
    const { query } = this.props;
    const noContentMsg = query
      ? 'No results found'
      : 'There is no data for this section';
    return createElement(Component, {
      ...this.props,
      noContentMsg,
      handleSearchChange: this.handleSearchChange,
      handleCategoryChange: this.handleCategoryChange,
      handleLocationChange: this.handleLocationChange
    });
  }
}

EmissionPathwaysScenarioTableComponent.propTypes = {
  query: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(
  connect(mapStateToProps, null)(EmissionPathwaysScenarioTableComponent)
);
