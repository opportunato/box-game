import * as types from '../constants/ActionTypes';

export function colorClickBox(index) {
  return { type: types.COLOR_CLICK_BOX, index };
}

export function smashCrystal() {
  return { type: types.SMASH_CRYSTAL };
}
