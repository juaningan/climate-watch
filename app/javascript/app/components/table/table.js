import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { SortDirection } from 'react-virtualized';
import _sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

import Component from './table-component';

class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { data, defaultColumns, sortBy } = props;
    const columns = defaultColumns || Object.keys(data[0]);
    this.state = {
      data,
      optionsOpen: false,
      sortBy: sortBy || Object.keys(data[0])[0],
      sortDirection: SortDirection.ASC,
      activeColumns: columns.map(d => ({
        label: upperFirst(lowerCase(d)),
        value: d
      })),
      columnsOptions: Object.keys(data[0]).map(d => ({
        label: upperFirst(lowerCase(d)),
        value: d
      }))
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: nextProps.data });
    }
  }

  setOptionsClose = () => {
    this.setState({ optionsOpen: false });
  };

  setOptionsOpen = () => {
    this.setState({ optionsOpen: true });
  };

  getDataSorted = (data, sortBy, sortDirection) => {
    const dataSorted = _sortBy(data, sortBy);
    return sortDirection === SortDirection.DESC
      ? reverse(dataSorted)
      : dataSorted;
  };

  toggleOptionsOpen = () => {
    this.setState(state => ({ optionsOpen: !state.optionsOpen }));
  };

  handleSortChange = ({ sortBy, sortDirection }) => {
    const { data } = this.state;
    const sortedData = this.getDataSorted(data, sortBy, sortDirection);
    this.setState({ data: sortedData, sortBy, sortDirection });
  };

  handleColumnChange = columns => {
    this.setState({ activeColumns: columns });
  };

  render() {
    const {
      data,
      sortBy,
      sortDirection,
      activeColumns,
      columnsOptions,
      optionsOpen
    } = this.state;
    return createElement(Component, {
      ...this.props,
      data,
      sortBy,
      optionsOpen,
      sortDirection,
      activeColumns,
      columnsOptions,
      handleSortChange: this.handleSortChange,
      handleColumnChange: this.handleColumnChange,
      setOptionsOpen: this.setOptionsOpen,
      setOptionsClose: this.setOptionsClose,
      toggleOptionsOpen: this.toggleOptionsOpen
    });
  }
}

TableContainer.propTypes = {
  data: PropTypes.array.isRequired,
  defaultColumns: PropTypes.array,
  sortBy: PropTypes.string.isRequired
};

TableContainer.defaultProps = {
  data: [],
  sortBy: 'value'
};

export default TableContainer;
