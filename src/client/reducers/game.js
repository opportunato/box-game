import * as types from '../constants/ActionTypes';
import * as phases from '../constants/Phases';
import * as objects from '../constants/Objects';

import { clone, range } from 'lodash';

const MAX_SMASH_CLICKS = 4;

const cornerPositions = [
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-right',
];

const sidePositions = [
  'top',
  'bottom',
  'left',
  'right',
];

const initialState = {
  phase: phases.SMASH,

  smashClicks: 0,

  boxCenterClicked: false,

  glowCoords: {
    x: null,
    y: null
  },

  corners: range(0, 4).map(number => ({
    clicked: false,
    position: cornerPositions[number]
  })),

  seeds: range(0, 4).map(number => ({
    clicked: false,
    position: sidePositions[number],
  })),
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

const allCornersClicked = (state) => {
  return {
    ...state,
    phase: state.corners.every(corner => corner.clicked) ?
      phases.SOUND : state.phase,
  };
};

const boxPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {
        case objects.BOX_CORNER:
          if (state.boxCenterClicked && (index === 0 || state.corners[index - 1].clicked)) {
            return allCornersClicked({
              ...state,
              corners: state.corners.map((box, _index) =>
                (_index === index) ? { ...box, clicked: true } : box
              ),
            });
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

const soundPhase = (state, action) => {
  switch (action.type) {
    case types.MOUSE_MOVE:
      const { object, coords } = action.options;

      switch (object) {
        case objects.GLIPH:
          return {
            ...state,
            glowCoords: clone(coords),
          };

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const catchPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {
        case objects.SEED:
          return {
            ...state,
            seeds: state.seeds.map((seed, _index) =>
              (_index === index) ? { ...seed, clicked: true } : seed
            ),
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
  [phases.SOUND]: soundPhase,
  [phases.CATCH]: catchPhase,
};

export default function game(state = initialState, action) {
  return phaseFunctions[state.phase](state, action);
}
