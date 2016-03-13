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

const dialogs = [
  {
    text: '...',
  },
  {
    text: '...',
  },
  {
    text: '...',
    options: [
      { text: 'Completely disgusting' },
      { text: 'I would gladly do that' },
      { text: 'I don\'t know' },
    ]
  },
  {
    text: '...',
    options: [
      {
        text: 'I want peace',
        response: 'No can do',
      },
      {
        text: 'I want gold',
        response: 'No can do',
      },
      {
        text: 'I want cola',
      },
    ]
  }
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
  jinnSize: 1,

  dialog: {
    ...dialogs[0],
    index: 0
  },

  lenseCoords: {
    x: null,
    y: null,
  },

  corners: range(0, 4).map(number => ({
    clicked: false,
    position: cornerPositions[number]
  })),

  seeds: range(0, 4).map(number => ({
    clicked: false,
    position: sidePositions[number],
  })),

  hatches: range(0, 4).map(number => ({
    clicked: false,
    position: cornerPositions[number]
  })),

  inventory: {
    gliphs: {
      0: false,
      1: false,
      2: false,
      3: false,
    },
    seedsNumber: 0,
  },
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
    inventory: allClicked ?
      { ...state.inventory, gliphs: { ...state.inventory.gliphs, 0: true } } : state.inventory,
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
    inventory: isGliphReached ?
      { ...state.inventory, gliphs: { ...state.inventory.gliphs, [gliphIndex + 1]: true } } : state.inventory,
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
    phase: allCaught ? phases.PLANT : state.phase,
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
            inventory: { ...state.inventory, seedsNumber: state.inventory.seedNumber + 1 },
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

const allHatchesClicked = (state) => {
  const allClicked = state.hatches.every(hatch => hatch.clicked);

  return {
    ...state,
    phase: allClicked ? phases.GROWTH : state.phase,
  };
};

const plantPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {
        case objects.HATCH:
          return allHatchesClicked({
            ...state,
            inventory: { ...state.inventory, seedsNumber: state.inventory.seedNumber - 1 },
            hatches: state.hatches.map((hatch, _index) =>
              (_index === index) ? { ...hatch, clicked: true } : hatch
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

const jinnGrown = (state) => {
  return {
    ...state,
    phase: state.jinnSize === 5 ? phases.DIALOG : state.phase,
  };
};

const jinnPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;

      switch (object) {

        case objects.GLIPH:
          return jinnGrown({
            ...state,
            jinnSize: state.jinnSize + 1,
            inventory: { ...state.inventory, gliphs: { ...state.inventory.gliphs, [index]: false } }
          });

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const nextDialog = (state) => {
  const nextIndex = state.dialog.index + 1;

  return {
    ...state,
    dialog: dialogs[nextIndex] ? {
      ...dialogs[nextIndex],
      index: nextIndex,
    } : null,
  };
};

const dialogPhase = (state, action) => {
  switch (action.type) {
    case types.CLICK:
      const { object, index } = action.options;
      const { dialog } = state;

      switch (object) {

        case objects.OPTION:
          const option = dialog.options[index];

          if (!option.response) {
            return nextDialog(state);
          }
          return {
            ...state,
            dialog: {
              ...dialog,
              text: option.response,
              options: dialog.options.slice(0, index)
                .concat(dialog.options.slice(index + 1))
            },
          };

        case objects.TEXT:
          if (!dialog.options) {
            return nextDialog(state);
          }
          return state;

        case objects.LENSE:
          return {
            ...state,
            phase: phases.LENSE,
          };

        default:
          return state;
      }
      break;

    default:
      return state;
  }
};

const lensePhase = (state, action) => {
  switch (action.type) {
    case types.MOUSE_MOVE:
      const { object, coords } = action.options;

      switch (object) {
        case objects.LENSE:
          return {
            ...state,
            lenseCoords: clone(coords),
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
  [phases.PLANT]: plantPhase,
  [phases.GROWTH]: growthPhase,
  [phases.JINN]: jinnPhase,
  [phases.DIALOG]: dialogPhase,
  [phases.LENSE]: lensePhase,
};

export default function game(state = initialState, action) {
  return phaseFunctions[state.phase](state, action);
}
