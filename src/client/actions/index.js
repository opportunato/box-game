import * as types from '../constants/ActionTypes';

export function clickBox(index) {
  return { type: types.CLICK_BOX, index };
}
