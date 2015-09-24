'use-strict';
import React from 'react';
import _ from 'lodash';
import { Row as GridRow, Col as GridColumn } from 'react-bootstrap';
import Immutable from 'immutable';
import renderChildren from './render-children';

/**
 * Takes a list of components and a list of grid row configs and produces
 * Bootstrap 3 grid markup.
 * @module Grid
 */
class Grid extends React.Component {
  /**
   * Add two numbers together.
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  static add(x, y) {
    return x + y;
  }

  /**
   * If the current row number is greater than 0 we need to add
   * one to it in order to get the sequential column number.
   * @param {number} n - current row number
   * @returns {number};
   */
  static getRowIndex(n) {
    return (n > 0) ? Grid.add(1, n) : n;
  }

  /**
   * Adds the children components to each column in sequence, distributing
   * components sequentially among available columns.
   * @param {array} rows
   * @param {array} components
   * @returns {array}
   */
  static distributeComponents(rows, components){
    // Fill available rows/columns with components
    let index = -1;
    let fullRows = _.map(rows, (row, i) => {
      return _.map(row, (col, n) => {
        index = index + 1;
        return Immutable.fromJS(col).set('children', _.at(components, index)).toJS();
      });
    });

    let extraRows = [];
    if ( index < components.length-1) {
      extraRows = _.map(components.slice(index+1), (component) => {
        return [{
          md: '12',
          children: [component]
        }];
      });
    }
    return fullRows.concat(extraRows);
  }

  render(){
    let numChildren = this.props.children ? this.props.children.length : 0;
    if(numChildren) {
      let rows = Grid.distributeComponents(this.props.rows, this.props.children);
      return (
        <div className="grid-layout">
        {_.map(rows, (row, i) => {
          return (
            <GridRow key={`row-${i}`}>
              {_.map(row, (col, n) => {
                let columnProps = _.omit(col, 'children');
                col.schema = this.props.schema;
                return (
                  <GridColumn key={`col-${n}`} {...columnProps}>
                    {renderChildren(col)}
                  </GridColumn>
                );
              })}
            </GridRow>
          );
        })}
        </div>
      );
    }else{
      return (<div className="grid-layout"></div>);
    }
  }
}

Grid.propTypes = {
  rows: React.PropTypes.arrayOf(React.PropTypes.arrayOf(
    React.PropTypes.shape({
      md: React.PropTypes.string,
      sm: React.PropTypes.string,
      xs: React.PropTypes.string
    })
  )).isRequired
};

Grid.defaultProps = {
  componentType: 'grid'
};

export default Grid;
