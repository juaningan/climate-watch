import { createSelector, createStructuredSelector } from 'reselect';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import uniq from 'lodash/uniq';
import { arrayToSentence } from 'utils';
import { getGhgEmissionDefaultSlugs, toPlural } from 'utils/ghg-emissions';
import { sortLabelByAlpha } from 'utils/graphs';
import {
  GAS_AGGREGATES,
  TOP_EMITTERS_OPTION,
  CALCULATION_OPTIONS
} from 'data/constants';
import {
  getMeta,
  getRegions,
  getSources,
  getSelection
} from './ghg-emissions-selectors-get';

const FEATURE_NEW_GHG = process.env.FEATURE_NEW_GHG === 'true';

const DEFAULTS = {
  breakBy: FEATURE_NEW_GHG
    ? 'regions'
    : `regions-${CALCULATION_OPTIONS.ABSOLUTE_VALUE.value}`,
  calculation: CALCULATION_OPTIONS.ABSOLUTE_VALUE.value
};

const getOptionSelectedFunction = filter => (options, selected) => {
  if (!options) return null;
  if (!selected) {
    const defaultOption = options.find(b => b.value === DEFAULTS[filter]);
    return defaultOption || options[0];
  }

  if (FEATURE_NEW_GHG && filter === 'breakBy') {
    return options.find(
      o => o.value === selected || selected.startsWith(o.value) // to support legacy URL
    );
  }

  return options.find(o => o.value === selected || o.name === selected);
};

// Sources selectors
const getSourceOptions = createSelector([getSources], sources => {
  if (!sources) return null;

  return sources.map(source => ({
    name: source.name,
    label: source.label,
    value: String(source.value)
  }));
});

const getSourceSelected = createSelector(
  [getSourceOptions, getSelection('source')],
  getOptionSelectedFunction('source')
);

// Calculation selectors
const getCalculationOptions = () => [
  {
    label: 'Total',
    value: CALCULATION_OPTIONS.ABSOLUTE_VALUE.value
  },
  {
    label: 'Per Capita',
    value: CALCULATION_OPTIONS.PER_CAPITA.value
  },
  {
    label: 'Per GDP',
    value: CALCULATION_OPTIONS.PER_GDP.value
  }
];

// BreakBy selectors
const getBreakByOptions = () =>
  (FEATURE_NEW_GHG
    ? [
      {
        label: 'Regions',
        value: 'regions'
      },
      {
        label: 'Regions-Total Aggregated',
        value: 'aggregated'
      },
      {
        label: 'Sectors',
        value: 'sector'
      },
      {
        label: 'Gases',
        value: 'gas'
      }
    ]
    : [
      {
        label: 'Regions',
        value: `regions-${CALCULATION_OPTIONS.ABSOLUTE_VALUE.value}`
      },
      {
        label: 'Regions-Per Capita',
        value: `regions-${CALCULATION_OPTIONS.PER_CAPITA.value}`
      },
      {
        label: 'Regions-Per GDP',
        value: `regions-${CALCULATION_OPTIONS.PER_GDP.value}`
      },
      {
        label: 'Sectors',
        value: 'sector'
      },
      {
        label: 'Gases',
        value: 'gas'
      }
    ]);

const getCalculationSelected = createSelector(
  [getCalculationOptions, getSelection('calculation'), getSelection('breakBy')],
  (options, selected, breakBySelected) => {
    if (!options) return null;
    if (!selected) {
      const breakByArray = breakBySelected && breakBySelected.split('-');
      if (breakByArray && breakByArray[1]) {
        return options.find(
          o => o.value === breakByArray[1] // to support legacy URLs
        );
      }

      const defaultOption = options.find(b => b.value === DEFAULTS.calculation);
      return defaultOption || options[0];
    }

    return options.find(o => o.value === selected);
  }
);

const getBreakByOptionSelected = createSelector(
  [getBreakByOptions, getSelection('breakBy')],
  getOptionSelectedFunction('breakBy')
);

const getBreakBySelected = createSelector(
  [getBreakByOptionSelected],
  breakBySelected => {
    if (!breakBySelected) return null;
    const selected = breakBySelected.value.split('-')[0];
    const isAggregated = selected === 'aggregated';
    return {
      modelSelected: isAggregated ? 'regions' : selected,
      isAggregated
    };
  }
);

export const getModelSelected = createSelector(
  getBreakBySelected,
  breakBySelected => (breakBySelected && breakBySelected.modelSelected) || null
);
export const getMetricSelected = createSelector(
  [getCalculationSelected],
  calculationSelected =>
    (calculationSelected && calculationSelected.value) || null
);
export const getIsRegionAggregated = createSelector(
  getBreakBySelected,
  breakBySelected => (breakBySelected && breakBySelected.isAggregated) || null
);

const filterOptionsBySource = field =>
  createSelector([getMeta, getSourceSelected], (meta, sourceSelected) => {
    if (isEmpty(meta) || !sourceSelected) return null;
    const fieldOptions = meta[field];
    const sourceValue = sourceSelected.value;
    const sourceMeta = meta.data_source.find(
      s => String(s.value) === sourceValue
    );
    const allowedIds = sourceMeta[field];
    return fieldOptions.filter(o => allowedIds.includes(o.value));
  });

const getFieldOptions = field =>
  createSelector([filterOptionsBySource(field)], filteredOptions => {
    if (!filteredOptions) return [];
    const fieldOptions = filteredOptions;
    return sortLabelByAlpha(fieldOptions);
  });

const getRegionOptions = createSelector(
  [getRegions, getSourceSelected, getFieldOptions('location')],
  (regions, sourceSelected, options) => {
    if (!regions || !sourceSelected) return null;

    const regionOptions = [TOP_EMITTERS_OPTION];
    regions.forEach(region => {
      if (
        sourceSelected.name.startsWith('UNFCCC') &&
        region.iso_code3 === 'WORLD'
      ) {
        return;
      }
      const regionMembers = region.members.map(m => m.iso_code3);
      regionOptions.push({
        label: region.wri_standard_name,
        value: region.iso_code3,
        iso: region.iso_code3,
        expandsTo: regionMembers,
        groupId: 'regions'
      });
    });

    const countryOptions = [];
    const regionISOs = regionOptions.map(r => r.iso);

    options.forEach(d => {
      if (!regionISOs.includes(d.iso)) {
        countryOptions.push({
          ...d,
          value: d.iso,
          groupId: 'countries'
        });
      }
    });
    const sortedRegions = sortLabelByAlpha(regionOptions).sort(x =>
      (x.value === 'TOP' ? -1 : 0)
    );
    return sortedRegions.concat(sortLabelByAlpha(countryOptions));
  }
);

const getSectorOptions = createSelector(
  [getFieldOptions('sector')],
  options => {
    if (!options || isEmpty(options)) return null;
    const hasChildren = d => options.some(o => o.parentId === d.value);
    const aggregatesComesFirst = o => (o.groupId === 'totals' ? -1 : 0);

    const sectors = options
      .filter(s => !s.parentId)
      .map(d => ({
        label: d.label,
        value: d.value,
        expandsTo: d.aggregatedSectorIds,
        groupParent: hasChildren(d) ? String(d.value) : null,
        optGroup: isEmpty(d.aggregatedSectorIds) ? 'sectors' : 'totals'
      }))
      .sort(aggregatesComesFirst);

    const subsectors = options
      .filter(s => s.parentId)
      .map(d => ({
        label: d.label,
        value: d.value,
        group: String(d.parentId)
      }));
    return [...sectors, ...subsectors];
  }
);

const getGasOptions = createSelector([getFieldOptions('gas')], options => {
  if (!options) return [];

  const valueByLabel = g => (options.find(opt => opt.label === g) || {}).value;

  return options.map(o => ({
    ...o,
    expandsTo:
      GAS_AGGREGATES[o.label] &&
      GAS_AGGREGATES[o.label].map(valueByLabel).filter(v => v)
  }));
});

const CHART_TYPE_OPTIONS = [
  { label: 'Line chart', value: 'line' },
  { label: 'Stacked area Chart', value: 'area' },
  { label: '100% stacked area chart', value: 'percentage' }
];

const getChartTypeOptions = () => CHART_TYPE_OPTIONS;

export const getOptions = createStructuredSelector({
  sources: getSourceOptions,
  chartType: getChartTypeOptions,
  breakBy: getBreakByOptions,
  calculation: getCalculationOptions,
  regions: getRegionOptions,
  sectors: getSectorOptions,
  gases: getGasOptions
});

const getDefaults = createSelector(
  [getSourceSelected, getMeta],
  (sourceSelected, meta) => {
    if (!sourceSelected || !meta) return null;
    return getGhgEmissionDefaultSlugs(sourceSelected, meta);
  }
);

const isIncluded = (field, selectedValues, filter) => {
  const kebabInclude = selectedValues.includes(kebabCase(filter.label));
  const valueOrIsoInclude =
    selectedValues.includes(String(filter.value)) ||
    selectedValues.includes(filter.iso_code3);

  return {
    location: valueOrIsoInclude,
    gas: kebabInclude,
    sector: kebabInclude
  }[field];
};

const getFiltersSelected = field =>
  createSelector(
    [getOptions, getSelection(field), getDefaults],
    (options, selected, defaults) => {
      if (!options || !defaults) return null;

      const fieldOptions =
        field === 'location' ? options.regions : options[toPlural(field)];
      const defaultSelection =
        defaults && defaults[field] && String(defaults[field]);

      // empty filter selected deliberately
      if (selected === '') return [];
      const selection = selected || defaultSelection;
      let selectedFilters = [];
      if (selection) {
        const selectedValues = selection.split(',');
        selectedFilters = fieldOptions.filter(filter =>
          isIncluded(field, selectedValues, filter)
        );
      }

      return selectedFilters;
    }
  );

const getChartTypeSelected = createSelector(
  [getChartTypeOptions, getSelection('chartType')],
  getOptionSelectedFunction('chartType')
);

const getOverlappingConflicts = optionsSelected => {
  if (!optionsSelected || optionsSelected.length <= 1) return [];

  const conflicts = [];
  const overlapsCheckedIds = [];

  optionsSelected.forEach(option => {
    if (option.expandsTo) {
      const overlappingOptions = [];
      optionsSelected.forEach(option2 => {
        if (option2.value === option.value) return;
        if (overlapsCheckedIds.includes(option2.value)) return;

        const expandedOption = [option.value, ...(option.expandsTo || [])].map(
          String
        );
        const expandedOption2 = [
          option2.value,
          option2.group,
          ...(option2.expandsTo || [])
        ].map(String);

        if (intersection(expandedOption, expandedOption2).length > 0) {
          overlappingOptions.push(option2.label);
        }
      });

      if (overlappingOptions.length) {
        conflicts.push(
          `${option.label} overlaps with ${arrayToSentence(overlappingOptions)}`
        );
      }

      overlapsCheckedIds.push(option.value);
    }
  });

  return conflicts;
};

const getGasConflicts = gasSelected => {
  const aggregatedGases = Object.keys(GAS_AGGREGATES);

  if (!gasSelected || gasSelected.length <= 1) return [];

  const conflicts = [];

  aggregatedGases.forEach(gas => {
    if (gasSelected.some(g => g.label.includes(gas))) {
      conflicts.push(`${gas} option cannot be selected with any other gas`);
    }
  });

  return conflicts;
};

const getChartConflicts = (metricSelected, chartSelected) => {
  const conflicts = [];

  if (
    ['PER_CAPITA', 'PER_GDP'].includes(metricSelected) &&
    chartSelected.value !== 'line'
  ) {
    const metricOption = CALCULATION_OPTIONS[metricSelected];
    conflicts.push(
      `${metricOption.label} metric is not allowed with ${chartSelected.label} chart`
    );
  }

  return conflicts;
};

export const getFiltersConflicts = createSelector(
  [
    getFiltersSelected('location'),
    getFiltersSelected('gas'),
    getFiltersSelected('sector'),
    getModelSelected,
    getMetricSelected,
    getChartTypeSelected
  ],
  (
    regionSelected,
    gasSelected,
    sectorsSelected,
    modelSelected,
    metricSelected,
    chartSelected
  ) => {
    let conflicts = [];
    let canChangeBreakByTo = difference(
      ['sector', 'gas', 'regions'],
      [modelSelected]
    );
    const solutions = ['Please deselect all conflicting options'];
    const isAggregatedChart = chartSelected.value !== 'line';
    const notBreakBySector = modelSelected !== 'sector';
    const notBreakByGas = modelSelected !== 'gas';
    const notBreakByRegion = modelSelected !== 'regions';

    const sectorConflicts = getOverlappingConflicts(sectorsSelected);
    const regionConflicts = getOverlappingConflicts(regionSelected);
    const gasConflicts = getGasConflicts(gasSelected);
    const chartConflicts = getChartConflicts(metricSelected, chartSelected);

    if (sectorConflicts.length) {
      canChangeBreakByTo = difference(canChangeBreakByTo, ['gas', 'regions']);
    }
    if (regionConflicts.length) {
      canChangeBreakByTo = difference(canChangeBreakByTo, ['sector', 'gas']);
    }
    if (gasConflicts.length) {
      canChangeBreakByTo = difference(canChangeBreakByTo, [
        'sector',
        'regions'
      ]);
    }

    if (sectorConflicts.length && (isAggregatedChart || notBreakBySector)) {
      conflicts = conflicts.concat(sectorConflicts);
    }

    if (gasConflicts.length && (isAggregatedChart || notBreakByGas)) {
      conflicts = conflicts.concat(gasConflicts);
    }

    if (regionConflicts.length && (isAggregatedChart || notBreakByRegion)) {
      conflicts = conflicts.concat(regionConflicts);
    }

    conflicts = conflicts.concat(chartConflicts);

    if (conflicts.length && isAggregatedChart) {
      solutions.push('change "Chart Type" to line chart');
    }

    if (canChangeBreakByTo.length) {
      solutions.push(
        `change "Break by" to ${arrayToSentence(canChangeBreakByTo)}`
      );
    }

    return {
      conflicts,
      solutionText: uniq(solutions).join(' or ')
    };
  }
);

export const getOptionsSelected = createStructuredSelector({
  sourcesSelected: getSourceSelected,
  regionsSelected: getFiltersSelected('location'),
  sectorsSelected: getFiltersSelected('sector'),
  gasesSelected: getFiltersSelected('gas'),
  breakBySelected: getBreakByOptionSelected,
  calculationSelected: getCalculationSelected,
  chartTypeSelected: getChartTypeSelected
});
