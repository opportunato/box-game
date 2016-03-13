import * as types from '../constants/ActionTypes';
import * as phases from '../constants/Phases';
import * as objects from '../constants/Objects';

import { range } from 'lodash';

const MAX_SMASH_CLICKS = 4;

const phasesOrder = [
  phases.SMASH,
  phases.BOX,
];

const positions = [
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-right',
];

const initialState = {
  phase: phasesOrder[0],

  smashClicks: 0,

  boxCenterClicked: false,

  corners: range(0, 4).map(number => ({
    clicked: false,
    position: positions[number]
  }))
};

const smashPhase = (state, action) => {
  switch (action.type) {

    case types.CLICK:
      const { object } = action.options;

      switch (object) {
        case objects.ROCK:
          if (state.smashClicks >= MAX_SMASH_CLICKS - 1) {
            return {
              ...state,
              phase: phases.BOX,
            };
          }
          return {
            ...state,
            smashClicks: state.smashClicks += 1,
          };
        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const boxPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {
        case objects.BOX_CORNER:
          if (state.boxCenterClicked && index === 0 || state.corners[index - 1].clicked) {
            return {
              ...state,
              corners: state.corners.map((box, _index) =>
                (_index === index) ? { ...box, clicked: true } : box
              )
            };
          }
          return state;

        case objects.BOX_CENTER:
          return {
            ...state,
            boxCenterClicked: true,
          };

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const phaseFunctions = {
  [phases.SMASH]: smashPhase,
  [phases.BOX]: boxPhase,
};

export default function game(state = initialState, action) {
  return phaseFunctions[state.phase](state, action);
}
