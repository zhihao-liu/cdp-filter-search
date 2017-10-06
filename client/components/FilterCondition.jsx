const React = require('react');
const LabeledSelect = require('./LabeledSelect.jsx');
const LabeledInput = require('./LabeledInput.jsx');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      selectedField: '$null'
    };

    this.handleSelectedFieldChange = this.handleSelectedFieldChange.bind(this);
  }

  render() {
    const fieldOptionMap = {
      '$null': '-',
      '$keyword': 'Keyword',
      '$hashtag': 'Hashtag',
      '$place': 'Place',
      '$other': 'Other'
    };

    let otherFieldMap = {};
    for (const dataSrc of ['instagram', 'twitter']) {
      for (const field of allFields[dataSrc]) {
        otherFieldMap[field] = `${dataSrc}: ${field}`;
      }
    }

    return (
      <li className="FilterCondition">
        <LabeledSelect text='Field: ' optionMap={fieldOptionMap}
                       value={this.state.selectedField} name={this.props.nameSelectedField}                      
                       onChange={this.handleSelectedFieldChange} />

        {this.state.selectedField === '$other' &&
        <LabeledSelect optionMap={otherFieldMap} name={this.props.nameSelectedOtherField} />}

        <LabeledInput text='Query: ' name={this.props.nameQuery} />

        {['$keyword', '$hashtag'].includes(this.state.selectedField) &&
        <LabeledInput type='checkbox' text='Exact match'
                      labelPosition='after' name={this.props.nameCheckExactMatch} />}
      </li>
    );
  }

  handleSelectedFieldChange(e) {
    this.setState({
      selectedField: e.target.value
    });
  }
};