export const ADD_CHARACTER = "ADD_CHARACTER";
export const REMOVE_CHARACTER = "REMOVE_CHARACTER";
export const CHANGE_CHARACTER = "CHANGE_CHARACTER";

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

export const changeCharacterById = id => {
  const action = {
    type: CHANGE_CHARACTER,
    payload: id
  };
  return action;
};
