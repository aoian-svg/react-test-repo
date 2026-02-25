export const ADD_CHARACTER = "ADD_CHARACTER";
export const REMOVE_CHARACTER = "REMOVE_CHARACTER";
export const EXECUTE_DYNAMIC = "EXECUTE_DYNAMIC";

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

export const executeDynamic = code => {
  const action = {
    type: EXECUTE_DYNAMIC,
    payload: id
  };
  return action;
};
