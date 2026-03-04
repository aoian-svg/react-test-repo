export const ADD_CHARACTER = "ADD_CHARACTER";
export const REMOVE_CHARACTER = "REMOVE_CHARACTER";
export const REMOVE_CHARACTER = "TEST";

export const addCharacterById = id => {
  const action = {
    type: ADD_CHARACTER,
    payload: id
  };
  return action;
};

export const removeCharacterById = id => {
  const action = {
    type: REMOVE_CHARACTER,
    payload: id
  };
  return action;
};

export const test = test => {
  const action = {
    type: TEST,
    payload: id
  };
  return action;
};
