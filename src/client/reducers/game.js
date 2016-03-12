import * as types from '../constants/ActionTypes';

import { range } from 'lodash';

const positions = [
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-right',
];

const initialState = {
  phase: 1,

  boxes: range(0, 4).map(number => ({
    clicked: false,
    position: positions[number]
  }))
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case types.CLICK_BOX:
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
}
