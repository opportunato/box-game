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

const gliphCoords = [
  {
    x: 10,
    y: 30,
  },
  {
    x: 400,
    y: 300,
  },
  {
    x: 400,
    y: 0,
  }
];

const initialState = {
  phase: phases.SMASH,

  smashClicks: 0,

  boxCenterClicked: false,

  glowCoords: {
    x: null,
    y: null
  },

  glowOpacity: 0,

  gliphIndex: 0,

  plantClicked: false,

  corners: range(0, 4).map(number => ({
    clicked: false,
    position: cornerPositions[number]
  })),

  seeds: range(0, 4).map(number => ({
    clicked: false,
    position: sidePositions[number],
  })),

  inventory: [],
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
  const allClicked = state.corners.every(corner => corner.clicked);

  return {
    ...state,
    inventory: allClicked ? state.inventory.concat('gliph-01') : state.inventory,
    phase: allClicked ? phases.SOUND : state.phase,
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

const gliphDistance = (state) => {
  const { glowCoords, gliphIndex } = state;

  return Math.sqrt(
    Math.pow(glowCoords.x - gliphCoords[gliphIndex].x, 2) +
    Math.pow(glowCoords.y - gliphCoords[gliphIndex].y, 2)
  );
};

const reachedGliph = (state) => {
  const { gliphIndex } = state;
  const isGliphReached = gliphDistance(state) < 25;

  const collectedAllGliphs = isGliphReached &&
    gliphIndex === gliphCoords.length - 1;

  return {
    ...state,
    inventory: isGliphReached ? state.inventory.concat(`gliph-0${gliphIndex + 2}`) : state.inventory,
    phase: collectedAllGliphs ? phases.CATCH : state.phase,
    gliphIndex: isGliphReached ? state.gliphIndex + 1 : state.gliphIndex,
  };
};

const getGlowOpacity = (state) => {
  return (400 - gliphDistance(state)) / 400;
};

const soundPhase = (state, action) => {
  switch (action.type) {
    case types.MOUSE_MOVE:
      const { object, coords } = action.options;

      switch (object) {
        case objects.GLIPH:
          return reachedGliph({
            ...state,
            glowCoords: clone(coords),
            glowOpacity: getGlowOpacity(state),
          });

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const allSeedsCaught = (state) => {
  const allCaught = state.seeds.every(seed => seed.clicked);

  return {
    ...state,
    phase: allCaught ? phases.GROWTH : state.phase,
  };
};

const catchPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {
        case objects.SEED:
          return allSeedsCaught({
            ...state,
            inventory: state.inventory.concat('seed'),
            seeds: state.seeds.map((seed, _index) =>
              (_index === index) ? { ...seed, clicked: true } : seed
            ),
          });

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const growthPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object } = action.options;

      switch (object) {
        case objects.PLANT:
          return {
            ...state,
            plantClicked: true
          };

        case objects.FLOWER:
          return {
            ...state,
            phase: phases.JINN,
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
  [phases.GROWTH]: growthPhase,
};

export default function game(state = initialState, action) {
  return phaseFunctions[state.phase](state, action);
}
