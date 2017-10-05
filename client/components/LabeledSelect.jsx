import React from 'react';

export default class LabeledSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let options = []; 
    for (const option in this.props.optionMap) {
      options.push(
        <option value={option} key={option}>{this.props.optionMap[option]}</option>
      );
    }

    return (
      <label>{this.props.text}
        <select value={this.props.value} name={this.props.name}
                onChange={this.props.onChange && this.props.onChange.bind(this)}>
          {options}
        </select>
      </label>
    );
  }
}

LabeledSelect.defaultProps = {
  text: '',
  optionMap: {}
}