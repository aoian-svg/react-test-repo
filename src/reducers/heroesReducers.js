import { ADD_CHARACTER, REMOVE_CHARACTER } from "../actions";
import { getCharacterById } from "../utils/characters";

const heroes = (state = [], action) => {
  switch (action.type) {
    case ADD_CHARACTER: {
      const character = getCharacterById(action.payload);
      return character ? [...state, character] : state;
    }
    case REMOVE_CHARACTER:
      return state.filter(hero => hero.id !== action.payload);
    default:
      return state;
  }
};

export default heroes;
