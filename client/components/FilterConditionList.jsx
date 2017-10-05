import React from 'react';
import FilterCondition from './FilterCondition.jsx';
import { initialNumConditions } from '../client.config.js'

export default class FilterConditionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numItems: initialNumConditions
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
        nameQuery: `query${i}`
      };

      conditionList.push(<FilterCondition {...props} />);
    }

    return (
      <ul className='FilterConditionList'>{conditionList}</ul>
    );
  }
}