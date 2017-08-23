import { combineReducers } from 'redux';
import { handleActions } from 'app/utils/redux';

import { reducers as countryExplorerReducers } from 'components/country-explorer';
import { reducers as countrySelectReducers } from 'components/countries-select';
import { reducers as countryNDCReducers } from 'components/ndc-country';
import { reducers as navReducers } from 'components/nav';
import { reducers as mapReducers } from 'components/map';
import { reducers as homeReducers } from 'pages/home';
import initialState from './data/initial-state';
import allActions from './actions';

export default combineReducers({
  countryNDC: handleActions(
    'countryNDC',
    allActions,
    countryNDCReducers,
    initialState
  ),
  countryExplorer: handleActions(
    'countryExplorer',
    allActions,
    countryExplorerReducers,
    initialState
  ),
  countrySelect: handleActions(
    'countrySelect',
    allActions,
    countrySelectReducers,
    initialState
  ),
  nav: handleActions('nav', allActions, navReducers, initialState),
  map: handleActions('map', allActions, mapReducers, initialState),
  home: handleActions('home', allActions, homeReducers, initialState)
});
