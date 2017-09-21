import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import styles from './table-styles.scss';

class SimpleTable extends PureComponent {
  render() {
    const {
      data,
      rowHeight,
      headerHeight,
      sortBy,
      sortDirection,
      handleSort
    } = this.props;
    if (!data.length) return null;

    const columns = Object.keys(data[0]);
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            className={styles.table}
            width={width}
            height={460}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={data.length}
            sort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            rowGetter={({ index }) => data[index]}
          >
            {columns.map(column => (
              <Column
                className={styles.column}
                key={column}
                label={column}
                dataKey={column}
                width={300}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

SimpleTable.propTypes = {
  data: PropTypes.array,
  rowHeight: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired
};

SimpleTable.defaultProps = {
  rowHeight: 45,
  headerHeight: 30
};

export default SimpleTable;