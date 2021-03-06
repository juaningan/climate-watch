import { PureComponent, createElement } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from './ndcs-lts-actions';
import reducers, { initialState } from './ndcs-lts-reducers';

import Component from './ndcs-lts-component';

class NDCSLTSContainer extends PureComponent {
  componentWillMount() {
    this.props.fetchNDCSLTS();
  }

  render() {
    return createElement(Component, this.props);
  }
}

NDCSLTSContainer.propTypes = {
  fetchNDCSLTS: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default withRouter(connect(null, actions)(NDCSLTSContainer));
