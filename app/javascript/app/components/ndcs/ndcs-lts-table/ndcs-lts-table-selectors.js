import { createSelector } from 'reselect';
import { deburrUpper, filterQuery } from 'app/utils';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

const getCountries = state => state.countries || null;
const getCategories = state => state.categories || null;
const getIndicatorsData = state => state.indicators || null;
const getQuery = state => deburrUpper(state.query) || '';

export const getISOCountries = createSelector([getCountries], countries =>
  countries.map(country => country.iso_code3)
);

export const getIndicatorsParsed = createSelector(
  [getCategories, getIndicatorsData],
  (categories, indicators) => {
    if (!categories || !indicators || !indicators.length) return null;
    const categoryIds = Object.keys(categories).filter(
      // Need to get the NDC Enhancement data category to borrow the emissions figure from that dataset for consistency
      id =>
        categories[id].slug === 'longterm_strategy' ||
        categories[id].slug === 'ndc_enhancement' ||
        categories[id].slug === 'summary_information'
    );
    const preppedIndicators = sortBy(
      uniqBy(
        indicators.map(i => ({
          label: i.name,
          value: i.slug,
          categoryIds: i.category_ids,
          locations: i.locations
        })),
        'value'
      ),
      'label'
    );
    let filteredIndicators = [];
    categoryIds.forEach(id => {
      filteredIndicators = filteredIndicators.concat(
        preppedIndicators.filter(
          ind => ind.categoryIds.indexOf(parseInt(id, 10)) > -1
        )
      );
    });
    return filteredIndicators;
  }
);

export const tableGetSelectedData = createSelector(
  [getIndicatorsParsed, getCountries],
  (indicators, countries) => {
    if (!indicators || !indicators.length || !indicators[0].locations) {
      return [];
    }

    const refIndicator = indicators[0];

    return Object.keys(refIndicator.locations).map(iso => {
      if (refIndicator.locations[iso].value !== 'No Document Submitted') {
        const countryData =
          countries.find(country => country.iso_code3 === iso) || {};
        const row = {
          country: countryData.wri_standard_name || iso,
          iso
        };
        indicators.forEach(ind => {
          if (ind.locations[iso]) {
            row[ind.label] = ind.locations[iso].value;
          }
        });
        return row;
      }
      return false;
    });
  }
);

export const tableRemoveIsoFromData = createSelector(
  [tableGetSelectedData],
  data => {
    if (!data || isEmpty(data)) return null;

    return data.map(d => {
      const updatedTableDataItem = { ...d };
      let date = d['Submission Date'];
      try {
        date = new Date(d['Submission Date']);
        date = !isNaN(date.getTime())
          ? {
            name: date.toLocaleDateString('en-US'),
            value: date.getTime()
          }
          : {
            name: undefined,
            value: undefined
          };
      } catch (e) {
        console.error(e);
      }
      updatedTableDataItem['Submission Date'] = date;
      updatedTableDataItem.Document = d.Document
        ? updatedTableDataItem.Document.replace(
          'href=',
          "target='_blank' href="
        )
        : undefined;
      const isoLink = `/ndcs/country/${d.iso}`;
      updatedTableDataItem.country = `<a href='${isoLink}'>${d.country}</a>`;
      delete updatedTableDataItem.iso;
      return updatedTableDataItem;
    });
  }
);

export const getDefaultColumns = createSelector(
  [getIndicatorsParsed],
  indicators => {
    if (!indicators || isEmpty(indicators)) return [];

    const columnIds = [
      'country',
      'ndce_ghg',
      'lts_target',
      'lts_document',
      'lts_date'
    ];

    return columnIds.map(id => {
      const match = indicators.find(indicator => indicator.value === id);
      return match ? match.label : id;
    });
  }
);

const getFilteredData = createSelector(
  [tableRemoveIsoFromData, getDefaultColumns],
  (data, columnHeaders) => {
    if (!data || isEmpty(data)) return null;
    return data
      .map(d => {
        const filteredHeadersD = {};
        Object.keys(d).forEach(k => {
          if (columnHeaders.includes(k)) {
            filteredHeadersD[k] = d[k];
          }
        });
        return filteredHeadersD;
      })
      .filter(d => !d.country.includes('undefined')); // Should be removed when the data is fixed
  }
);

export const getFilteredDataBySearch = createSelector(
  [getFilteredData, getQuery],
  (data, query) => {
    if (!data || isEmpty(data)) return null;
    return filterQuery(data, query);
  }
);

export default {
  tableRemoveIsoFromData,
  getDefaultColumns
};
