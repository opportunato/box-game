import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { click, mouseMove } from '../../actions';

// import CenterGliph from './CenterGliph';

import s from './App.scss';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { clone } from 'lodash';

const nextPosition = {
  'top': 'right',
  'right': 'bottom',
  'bottom': 'left',
  'left': 'top',
};

class Box extends Component {

  static propTypes = {
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    phase: PropTypes.string.isRequired,
    gliphIndex: PropTypes.number.isRequired,
    glow: PropTypes.object.isRequired,
    corners: PropTypes.array.isRequired,
    hatches: PropTypes.array.isRequired,
    seeds: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      seedMoving: false,
      seeds: clone(props.seeds),
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.phase === phases.CATCH && this.props.phase === phases.SOUND) {
      setTimeout(() => {
        this.setState({ seedMoving: true });

        const moveSeeds = () => {
          this.timeout = setTimeout(() => {
            this.setState({
              seeds: this.state.seeds.map((seed, index) => ({
                ...seed, position: nextPosition[this.state.seeds[index].position],
              }))
            });
            moveSeeds();
          }, 1000);
        };
        moveSeeds();
      }, 1000);
    }

    this.setState({
      seeds: newProps.seeds.map((seed, index) => ({
        ...seed, position: this.state.seeds[index].position,
      }))
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }


  clickCorner(index) {
    this.props.click({ object: objects.BOX_CORNER, index });
  }

  clickSeed(index) {
    this.props.click({ object: objects.SEED, index });
  }

  clickHatch(index) {
    this.props.click({ object: objects.HATCH, index });
  }

  clickCenter() {
    this.props.click({ object: objects.BOX_CENTER });
  }

  mouseMove(e) {
    const { pageX, pageY } = e;
    const container = this.refs.gliph;

    this.props.mouseMove({
      object: objects.GLIPH,
      coords: {
        x: pageX - (window.innerWidth - container.offsetWidth) / 2,
        y: pageY - (window.innerHeight - container.offsetHeight) / 2,
      }
    });
  }


  render() {
    const {
      boxCenterClicked,
      corners,
      hatches,
      phase,
      glow,
      gliphIndex
    } = this.props;

    if ([phases.BOX, phases.SOUND, phases.CATCH, phases.PLANT].indexOf(phase) === -1) return null;

    return (
      <div
        className = {
          classNames({
            [s.box]: true,
            [s.compact]: [phases.CATCH, phases.PLANT].indexOf(phase) === -1,
          })
        }
      >
        {
          [
            'top-left',
            'bottom-right',
            'bottom-left',
            'top-right',
          ].map((position, index) =>
            <div
              key = { index }
              className = {
                classNames({
                  [s.corner]: true,
                  [s[position]]: true,
                  [s.opened]: [phases.CATCH, phases.PLANT].indexOf(phase) > -1,
                })
              }
            >
              {
                [phases.CATCH, phases.PLANT].indexOf(phase) > -1 && <div
                  className = {
                    classNames({
                      [s.hatch]: true,
                      [s.clicked]: hatches[index].clicked,
                    })
                  }
                  onClick = { this.clickHatch.bind(this, index) }
                />
              }
            </div>
          )
        }
        {
          this.state.seeds.map((seed, index) =>
            <div
              key = { index }
              className = {
                classNames({
                  [s.seed]: true,
                  [s.clicked]: seed.clicked,
                  [s[seed.position]]: true,
                  [s.opened]: [phases.CATCH, phases.PLANT].indexOf(phase) > -1,
                  [s.moving]: this.state.seedMoving,
                })
              }
              onClick = { this.clickSeed.bind(this, index) }
            />
          )
        }
        {
          phase === phases.BOX && corners.map((corner, index) =>
            <button
              key = { index }
              className = {
                classNames({
                  [s['corner-spot']]: true,
                  [s[corner.position]]: true,
                  [s.clicked]: corner.clicked,
                  [s.clickable]: boxCenterClicked,
                })
              }
              onClick = { this.clickCorner.bind(this, index) }
            />
          )
        }
        <button
          className = { s.center }
          onClick = { this.clickCenter.bind(this) }
        />
        {
          phase === phases.SOUND &&
          <div
            className = { s.glow }
            style = {{
              left: glow.coords.x,
              top: glow.coords.y,
              opacity: glow.opacity,
              backgroundImage: `url(${require(`./box/glow-0${gliphIndex + 1}.png`)})`
            }}
          />
        }
        {
          phase === phases.SOUND &&
          <div
            ref = "gliph"
            className = { s.gliph }
            onMouseMove = { this.mouseMove.bind(this) }
          />
        }
      </div>
    );
  }

}

export default connect(
  state => ({
    phase: state.phase,
    corners: state.corners,
    hatches: state.hatches,
    seeds: state.seeds,
    glow: state.glow,
    gliphIndex: state.gliphIndex,
    boxCenterClicked: state.boxCenterClicked,
  }),
  { click, mouseMove }
)(Box);
