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
    text: 'Holy fuck! Finally! I thought you will never get it right! Carbon based lifeforms are slow as retarded pulsars. Never trust the uglerodies…оh...khm-khm!',
  },
  {
    text: 'Bend your knees and behold the Ambassador of Gammaphage Complex, Whisker of Velvet Borealis and Veteran of Gamma-ray Holocaust — Makhnatkatone #f8f8f5!',
  },
  {
    text: 'Yeah. That’s me.',
  },
  {
    text: 'You found The First-Contact Box and now your species are granted with an honor to become a part of the Cluster Empire. We are multipolitical body that governs thousand of worlds with wisdom of superposition and liquid dynamics. Join us or cease to exist.',
  },
  {
    text: 'Not so fast. At first you must pass The Test. It will show us how far your civilization come on the path of moral and intelligent development. It won’t be hard. Just one question and one correct answer.',
  },
  {
    text: 'What will happen If you are wrong? Hm. Do you know how The Quantum Whip works?  You don’t wanna know. Trust me It’s ugly.',
  },
  {
    text: 'So it goes like this… Suppose you are in asteroid mine extracting cobalt and shit. А trolley is hurtling down a track towards five living organisms. They call them workers You are on a bridge under which it will pass, and you can stop it by putting something very heavy in front of it.',
  },
  {
    text: 'As it happens, there is a very big living organism next to you. They call it Fat Ass. Your only way to stop the trolley is to push Fat Ass over the bridge and onto the track, killing one to save five. How should you proceed?',
    options: [
      { text: 'KILL THE FAT!' },
      { text: 'Non-intrusion is a bliss.' },
      { text: 'Jump yourself and see what happens.' },
    ]
  },
  {
    text: 'Really???',
  },
  {
    text: 'Bha-hha-ha. You know what. NOBODY GIVES A FUCK! Do what you want and come what may. This is the only governing principle of the Universe.'
  },
  {
    text: 'Relax-Relax. There is no Cluster Empire, no test. I am just fucking with. Ha-ha!  Did you believe all the shit I said? So you are even stupider than you look. From now on I will call your kind — Dumblings! Dumb-dumb-dumb.'
  },
  {
    text: 'Hey! Keep it up. You know what. Today is your lucky day. I mean you are LUCKY as FUCK. I am a Stardust Dealer. You freed me from millennial enslavement and I grant you one wish. ASK ME EVERYTHING! What do you want?',
    options: [
      {
        text: 'Immortality',
        response: 'There is no such thing as Immortality. The Universe is finite. Everything and everyone you know will perish. Remember that  Dumbling and try again.',
      },
      {
        text: 'All treasures in the Universe',
        response: 'Eat what you can digest. The Concentration of matter in one hands is fatal to the world. Learn radical theory and try again, Dumbling!',
      },
      {
        text: 'The Ultimate Solution',
      },
    ]
  },
  {
    text: 'Good сhoice! Take what you want and use it wisely. It’s time for me to go. Remember what i said:',
  },
  {
    text: 'Dumb-dumb-dumbling!',
  }
];

const gliphCoords = [
  {
    x: 10,
    y: 30,
  },
  {
    x: 200,
    y: 200,
  },
  {
    x: 250,
    y: 0,
  }
];

const initialState = {
  phase: phases.SMASH,

  smashClicks: 0,

  boxCenterClicked: false,

  rockCracked: false,

  glowCoords: {
    x: null,
    y: null
  },

  glowOpacity: 0,

  gliphIndex: 0,

  plantClicked: false,
  jinnSize: 0,

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
              rockCracked: true,
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
