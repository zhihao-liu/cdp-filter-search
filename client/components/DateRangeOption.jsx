'use strict';

const React = require('react');
const LabeledInput = require('./LabeledInput.jsx');

module.exports = class extends React.Component {
  render() {
    return (
      <div>
        <span>Date range: </span>
        <LabeledInput type='date' text='From ' name='fromDate' />
        <LabeledInput type='date' text=' To ' name='toDate' />
      </div>
    );
  }
};