const React = require('react');

class LabeledInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isLabeledAfter = this.props.labelPosition === 'after';

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
};

module.exports = LabeledInput;