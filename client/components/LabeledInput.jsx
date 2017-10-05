import React from 'react';

export default class LabeledInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isLabeledAfter = 
      this.props.labelPosition === 'after' ? true : false;

    return (
      <label>
        {!isLabeledAfter && this.props.text}
        <input type={this.props.type} name={this.props.name} />
        {isLabeledAfter && this.props.text}
      </label>
    );
  }
}

LabeledInput.defaultProps = {
  text: '',
  labelPosition: 'before'
}