import React, { Component, PropTypes } from 'react';

class SpriteAnimation extends Component {

  static propTypes = {
    className: PropTypes.string.isRequired,
    steps: PropTypes.number.isRequired,
    spriteSize: PropTypes.number.isRequired,
    onEnd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  componentDidMount() {
    this.nextStep();
  }

  getStyle() {
    return {
      backgroundPosition: `${-this.props.spriteSize * this.state.step}px top`,
    };
  }

  nextStep() {
    if (this.state.step >= this.props.steps) {
      this.props.onEnd();
      return;
    }

    setTimeout(() => {
      this.setState({
        step: this.state.step + 1,
      });
      this.nextStep();
    }, 100);
  }


  render() {
    return (
      <div
        className = { this.props.className }
        style = { this.getStyle() }
      />
    );
  }
}

export default SpriteAnimation;
