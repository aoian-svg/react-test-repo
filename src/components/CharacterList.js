import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addCharacterById } from "../actions";

const CharacterList = props => {
  const { characters, addCharacterById } = props;

  const handleAddCharacter = id => {
    addCharacterById(id);
  };

  return (
    <div>
      <h5>Characters</h5>
      <ul className="list-group">
        {characters.map(character => {
          return (
            <li key={character.id} className="list-group-item">
              {character.name}
              <div
                onClick={() => handleAddCharacter(character.id)}
                className="d-inline float-right right-btn"
                role="button"
                tabIndex={0}
                onKeyPress={() => handleAddCharacter(character.id)}
              >
                +
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return { characters: state.characters };
};

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators({addCharacterById},dispatch)
// };

CharacterList.propTypes = {
  characters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  addCharacterById: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { addCharacterById }
)(CharacterList);
