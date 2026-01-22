import characters_json from "../data/characters.json";
import { ADD_CHARACTER, REMOVE_CHARACTER } from "../actions";
import { getCharacterById } from "../utils/characters";

const characters = (state = characters_json, action) => {
  switch (action.type) {
    case ADD_CHARACTER: {
      return state.filter(item => item.id !== action.payload);
    }
    case REMOVE_CHARACTER: {
      const character = getCharacterById(action.payload);
      return character ? [...state, character] : state;
    }
    default:
      return state;
  }
};

export default characters;
