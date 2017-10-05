import React from 'react';
import LabeledInput from './LabeledInput.jsx';
import { dataSources } from '../client.config.js'

const utilities = require('../../lib/utilities');

export default class DataSourceOption extends React.Component {
  render() {
    let options = [];
    for (const dataSrc of dataSources) {
      options.push(
        <LabeledInput key={dataSrc}
                      type='checkbox' labelPosition='after'
                      text={utilities.capitalize(dataSrc)} />
      );
    }

    return (
      <span className='DataSourceOption'>{'Data source: '}{options}</span>
    );
  }
}