import * as types from '../constants/ActionTypes';

export function click(options = {}) {
  return { type: types.CLICK, options };
}

export function mouseMove(options = {}) {
  return { type: types.MOUSE_MOVE, options };
}
