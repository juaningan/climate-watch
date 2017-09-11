import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';

const getCountries = state => state.data;
const getLocations = state => state.locations;
const getIso = state => state.iso;
const getAllIndicators = state => (state.data ? state.data.indicators : {});
const getCategories = state => (state.data ? state.data.categories : {});

const getCountryByIso = (countries, iso) =>
  countries.find(country => country.iso_code3 === iso);

export const getCountriesOptions = createSelector([getCountries], countries => {
  const countriesOptions = countries.map(country => ({
    label: country.wri_standard_name,
    value: country.iso_code3
  }));
  return countriesOptions;
});

export const getActiveCountries = createSelector(
  [getCountries, getLocations],
  (countries, locations) => {
    const activeCountries = locations.map(location => {
      const countryDetail = countries.find(
        country => country.iso_code3 === location
      );
      return {
        label: countryDetail.wri_standard_name,
        value: countryDetail.iso_code3
      };
    });
    return activeCountries;
  }
);

export const getIndicators = createSelector(getAllIndicators, data =>
  groupBy(data, 'category_id')
);

export const parseIndicatorsDefs = createSelector(
  [getIndicators, getLocations],
  (indicators, countries) => {
    const parsedIndicators = {};
    Object.keys(indicators).forEach(category => {
      const parsedDefinitions = indicators[category].map(def => {
        const descriptions = countries.map(country => ({
          iso: country,
          value: def.locations[country] ? def.locations[country].value : null
        }));
        return {
          title: def.name,
          slug: def.slug,
          descriptions
        };
      });
      parsedIndicators[category] = parsedDefinitions;
    });
    return parsedIndicators;
  }
);

export const getNDCs = createSelector(
  [getCategories, parseIndicatorsDefs],
  (categories, indicators) => {
    if (!categories) return [];
    const ndcs = Object.keys(categories).map(category => ({
      title: categories[category].name,
      slug: categories[category].slug,
      definitions: indicators[category] ? indicators[category] : []
    }));
    return ndcs;
  }
);

export const getCountry = createSelector(
  [getCountries, getIso],
  getCountryByIso
);

export default {
  getCountry,
  getCountriesOptions,
  getActiveCountries,
  getNDCs
};