import * as ActionTypes from "../actions/actionTypes";
import MessageTypes from "../const/MessageTypes";

function push(type, text) {
  return { type: ActionTypes.PUSH_MESSAGE, message: { type, text } };
}

export function error(text) {
  return push(MessageTypes.ERROR, text);
}

export function warn(text) {
  return push(MessageTypes.WARN, text);
}

export function success(text) {
  return push(MessageTypes.SUCCESS, text);
}

export function pop() {
  return { type: ActionTypes.POP_MESSAGE };
}
