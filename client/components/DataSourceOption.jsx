const React = require('react');
const LabeledInput = require('./LabeledInput.jsx');
const clientConfig = require('../../config/client.config.js');

const { capitalize } = require('../../modules/utilities');

module.exports = class extends React.Component {
  render() {
    let options = [];
    for (const dataSrc of clientConfig.dataSources) {
      options.push(
        <LabeledInput key={dataSrc}
                      type='checkbox' labelPosition='after'
                      text={capitalize(dataSrc)} />
      );
    }

    return (
      <span className='DataSourceOption'>{'Data source: '}{options}</span>
    );
  }
};