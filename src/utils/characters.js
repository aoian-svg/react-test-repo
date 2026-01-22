import characters from "../data/characters.json";

export const getCharacterById = id => {
  const character = characters.find(item => item.id === id);
  return character ? { ...character } : null;
};
