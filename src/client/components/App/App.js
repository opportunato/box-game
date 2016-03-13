import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as phases from '../../constants/Phases';
import * as objects from '../../constants/Objects';

import { click, mouseMove } from '../../actions';

import s from './App.scss';

require('../base.css');

import classNames from 'classnames';

import 'babel-polyfill';

import { map, clamp } from 'lodash';

class App extends Component {

  static propTypes = {
    phase: PropTypes.string.isRequired,
    corners: PropTypes.array.isRequired,
    hatches: PropTypes.array.isRequired,
    seeds: PropTypes.array.isRequired,
    boxCenterClicked: PropTypes.bool.isRequired,
    plantClicked: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    mouseMove: PropTypes.func.isRequired,
    smashClicks: PropTypes.number.isRequired,
    inventory: PropTypes.object.isRequired,
    glowCoords: PropTypes.object.isRequired,
    glowOpacity: PropTypes.number.isRequired,
    gliphIndex: PropTypes.number.isRequired,
    jinnSize: PropTypes.number.isRequired,
    dialog: PropTypes.object.isRequired,
  }

  click(options, e) {
    e.preventDefault();

    this.props.click(options);
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
      phase,
      seeds,
      hatches,
      inventory,
      corners,
      smashClicks,
      boxCenterClicked,
      plantClicked,
      glowCoords,
      glowOpacity,
      gliphIndex,
      jinnSize,
      dialog,
    } = this.props;

    return (
      <div className={ s.root }>
        {
          phase === phases.SMASH &&
          <div
            className={
              classNames({
                [s.rock]: true,
                [s[`clicked-${smashClicks}`]]: true,
              })
            }
            onClick = { this.click.bind(this, { object: objects.ROCK }) }
          />
        }
        {
          [phases.BOX, phases.SOUND].indexOf(phase) > -1 &&
          <div
            className = { s.box }
          >
            {
              corners.map((corner, index) =>
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
                  onClick = { this.click.bind(this, { object: objects.BOX_CORNER, index }) }
                />
              )
            }
            <button
              className = { s.center }
              onClick = { this.click.bind(this, { object: objects.BOX_CENTER }) }
            />
            {
              phase === phases.SOUND &&
              <div
                className = { s.glow }
                style = {{
                  left: glowCoords.x,
                  top: glowCoords.y,
                  opacity: glowOpacity,
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
        }
        {
          [phases.CATCH, phases.PLANT].indexOf(phase) > -1 &&
          <div className = { s['box-placeholder'] }>
            {
              [
                'top-left',
                'bottom-right',
                'bottom-left',
                'top-right',
              ].map((position, index) =>
                <div
                  key = { position }
                  className = {
                    classNames({
                      [s.corner]: true,
                      [s[position]]: true,
                    })
                  }
                >
                  <div
                    clicked = { hatches[index].clicked }
                    className = { s.hatch }
                    onClick = { this.props.click.bind(this, { object: objects.HATCH, index }) }
                  />
                </div>
              )
            }
            {
              seeds.map((seed, index) =>
                <div
                  key = { seed.position }
                  className = {
                    classNames({
                      [s.seed]: true,
                      [s.clicked]: seed.clicked,
                      [s[seed.position]]: true,
                    })
                  }
                  onClick = { this.click.bind(this, { object: objects.SEED, index }) }
                />
              )
            }
          </div>
        }
        <div className = { s.inventory }>
          {
            map(inventory.gliphs, (item, index) =>
              item ?
              <div
                key = { `gliph-${index}` }
                style = {{
                  backgroundImage: `url(${require(`./inventory/gliph-0${+index + 1}.png`)})`
                }}
                onClick = { this.click.bind(this, { object: objects.GLIPH, index }) }
              /> : null
            )
          }
          {
            inventory.seedsNumber > 0 &&
            <div
              style = {{
                backgroundImage: `url(${require(`./inventory/seed.png`)})`
              }}
            />
          }
        </div>
        {
          phase === phases.GROWTH && !plantClicked &&
          <div
            className = { s.plant }
            onClick = { this.click.bind(this, { object: objects.PLANT }) }
          />
        }
        {
          [phases.SMASH, phases.BOX, phases.SOUND].indexOf(phase) === -1 &&
          <div
            className = { s.center + ' ' + s.separate }
          >
            {
              phase === phases.GROWTH && plantClicked &&
              <div
                className = { s.flower }
                onClick = { this.click.bind(this, { object: objects.FLOWER }) }
              />
            }
            {
              [phases.JINN, phases.DIALOG].indexOf(phase) > -1 &&
              <div
                style = {{
                  backgroundImage: `url(${require(`./jinn/jinn-0${clamp(jinnSize, 4)}.png`)})`
                }}
                className = { s.jinn }
              />
            }
          </div>
        }
        {
          phase === phases.DIALOG &&
          <div
            className = { s['dialog-speech'] }
            onClick = { this.click.bind(this, { object: objects.TEXT }) }
          >
            { dialog.text }
          </div>
        }
        {
          phase === phases.DIALOG &&
          <div className = { s['dialog-options'] }>
            {
              (dialog.options || []).map((option, index) =>
                <div
                  key = { index }
                  onClick = { this.click.bind(this, { object: objects.OPTION, index }) }
                >
                  { option.text }
                </div>
              )
            }
          </div>
        }
      </div>
    );
  }
}

/* eslint-disable no-undef */
export default connect(
  state => ({
    corners: state.corners,
    seeds: state.seeds,
    hatches: state.hatches,
    phase: state.phase,
    smashClicks: state.smashClicks,
    glowCoords: state.glowCoords,
    glowOpacity: state.glowOpacity,
    gliphIndex: state.gliphIndex,
    jinnSize: state.jinnSize,
    inventory: state.inventory,
    boxCenterClicked: state.boxCenterClicked,
    plantClicked: state.plantClicked,
    dialog: state.dialog,
  }),
  {
    click,
    mouseMove
  }
)(App);
