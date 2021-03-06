import { createStructuredSelector } from 'reselect';
import {
  getSearch,
  getLinkToDataExplorer
} from './ghg-emissions-selectors-get';
import {
  getOptions,
  getOptionsSelected,
  getFiltersConflicts,
  getModelSelected
} from './ghg-emissions-selectors-filters';
import {
  getChartConfig,
  getChartData,
  getChartDomain,
  getHideRemoveOptions,
  getLegendDataOptions,
  getLegendDataSelected,
  getLoading,
  getTableData,
  getDataZoomData,
  getTitleLinks
} from './ghg-emissions-selectors-data';
import { getProviderFilters } from './ghg-emissions-selectors-providers';

export const getGHGEmissions = createStructuredSelector({
  search: getSearch,
  downloadLink: getLinkToDataExplorer,
  options: getOptions,
  selected: getOptionsSelected,
  filtersConflicts: getFiltersConflicts,
  legendOptions: getLegendDataOptions,
  legendSelected: getLegendDataSelected,
  data: getChartData,
  tableData: getTableData,
  titleLinks: getTitleLinks,
  domain: getChartDomain,
  config: getChartConfig,
  dataZoomData: getDataZoomData,
  loading: getLoading,
  fieldToBreakBy: getModelSelected,
  hideRemoveOptions: getHideRemoveOptions,
  providerFilters: getProviderFilters
});
