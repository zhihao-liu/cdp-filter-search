import React from 'react';
import FilterConditionList from './FilterConditionList.jsx';
import DataSourceOption from './DataSourceOption.jsx';

export default class SearchLayout extends React.Component {
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
}