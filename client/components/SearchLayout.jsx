'use strict';

const React = require ('react');
const LabeledSelect = require('./LabeledSelect.jsx');
const LabeledInput = require('./LabeledInput.jsx');
const DateRangeOption = require('./DateRangeOption.jsx');
const FilterConditionList = require ('./FilterConditionList.jsx');
const DataSourceOption = require ('./DataSourceOption.jsx');

const { defaultResultLimit } = require('../../config/client.config.js');

module.exports = class extends React.Component {
  render() {
    const andOrMap = {
      '$and': 'AND',
      '$or': 'OR'
    }

    return (
      <div>
        <h1>Filter Search - City Digital Pulse 2.0</h1>
        <form action='/result' method='post'>
          <DateRangeOption />
          <FilterConditionList />
          <br />
          <LabeledSelect text='AND/OR' optionMap={andOrMap} name='andOrOption'/>
          <br />
          <DataSourceOption />
          <br />
          <input type='submit' value='Search' />
          <br/>
          <LabeledInput text='Result limit: ' name='resultLimit'
                        defaultValue={defaultResultLimit}
                        required={true} pattern='\d+' />
        </form>
      </div>
    );
  }
};