import { update, getTime, refreshDefaults } from './reducerUtil'

export const toggleState = {
  state:    1,  // [0 .. 1] for state, undefined for ignore
  delay:    0,  // delay in seconds
  fadeTime: 0,  // delay in seconds
  active: false,  // if not active the crownstone will not react to the event.
  updatedAt: 1
};
export const toggleStateAway = {
  state:    0,  // [0 .. 1] for state, undefined for ignore
  delay:    120,  // delay in seconds
  fadeTime: 0,  // delay in seconds
  active: false,  // if not active the crownstone will not react to the event.
  updatedAt: 1
};

export const updateToggleState = function (state, action) {
  if (action.data) {
    let newState = {...state};
    newState.state     = update(action.data.state,    newState.state);
    newState.delay     = update(action.data.delay,    newState.delay);
    newState.fadeTime  = update(action.data.fadeTime, newState.fadeTime);
    newState.active    = update(action.data.active,   newState.active);
    newState.updatedAt = getTime(action.data.updatedAt);
    return newState;
  }
  return state;
};

