'use strict';

const React = require('react');
const LabeledInput = require('./LabeledInput.jsx');
const clientConfig = require('../../config/client.config.js');

const { capitalize } = require('../../modules/utilities.js');

module.exports = class extends React.Component {
  render() {
    let options = [];
    for (const dataSrc of clientConfig.dataSources) {
      options.push(
        <LabeledInput key={dataSrc} name={`${dataSrc}Included`}
                      type='checkbox' text={capitalize(dataSrc)}
                      labelPosition='after' defaultChecked={true} />
      );
    }

    return (
      <span className='DataSourceOption'>{'Data source: '}{options}</span>
    );
  }
};