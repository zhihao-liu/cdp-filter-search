'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const IndexPage = require('./components/SearchLayout.jsx');

window.onload = () => {
  ReactDOM.render(<IndexPage />, document.getElementById('root'));
};