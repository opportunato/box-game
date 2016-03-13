import * as types from '../constants/ActionTypes';
import * as phases from '../constants/Phases';

import { range } from 'lodash';

const MAX_SMASH_CLICKS = 5;

const phasesOrder = [
  phases.SMASH,
  phases.COLOR,
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

  boxes: range(0, 4).map(number => ({
    clicked: false,
    position: positions[number]
  }))
};

const smashPhase = (state, action) => {
  switch (action.type) {

    case types.SMASH_CRYSTAL:
      if (state.smashClicks >= MAX_SMASH_CLICKS) {
        return {
          ...state,
          phase: phases.COLOR,
        };
      }
      return {
        ...state,
        smashClicks: state.smashClicks += 1,
      };

    default:
      return state;
  }
};

const colorPhase = (state, action) => {
  switch (action.type) {
    case types.COLOR_CLICK_BOX:
      if (action.index === 0 || state.boxes[action.index - 1].clicked) {
        return {
          ...state,
          boxes: state.boxes.map((box, index) =>
            (index === action.index) ? { ...box, clicked: true } : box
          )
        };
      }
      return state;

    default:
      return state;
  }
};

const phaseFunctions = {
  [phases.SMASH]: smashPhase,
  [phases.COLOR]: colorPhase,
};

export default function game(state = initialState, action) {
  return phaseFunctions[state.phase](state, action);
}
