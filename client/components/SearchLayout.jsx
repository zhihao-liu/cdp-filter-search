const React = require ('react');
const FilterConditionList = require ('./FilterConditionList.jsx');
const DataSourceOption = require ('./DataSourceOption.jsx');

module.exports = class extends React.Component {
  render() {
    return (
      <form action='result' method='post'>
        <FilterConditionList />
        <br />
        <DataSourceOption />
        <br />
        <input type='submit' value='Search' />
      </form>
    );
  }
};