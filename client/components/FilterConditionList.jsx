'use strict';

const React = require('react');
const FilterCondition = require('./FilterCondition.jsx');
const clientConfig = require('../../config/client.config.js');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numItems: clientConfig.initialNumConditions
    };
  } 

  render() {
    let conditionList = [];
    for (let i = 1; i <= this.state.numItems; ++i) {
      const props = {
        key: `filterCondition${i}`,
        nameSelectedField: `selectedField${i}`,
        nameSelectedOtherField: `selectedOtherField${i}`,
        nameCheckExactMatch: `exactMatch${i}`,
        nameQuery: `queryString${i}`
      };

      conditionList.push(<FilterCondition {...props} />);
    }

    return (
      <ul className='FilterConditionList'>{conditionList}</ul>
    );
  }
};