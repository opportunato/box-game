import * as types from '../constants/ActionTypes';

export function restartGame() {
  return { type: types.RESTART_GAME };
}