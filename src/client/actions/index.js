import * as types from '../constants/ActionTypes';

export function click(options = {}) {
  return { type: types.CLICK, options };
}
