import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { removeCharacterById } from "../actions";

const HeroList = props => {
  const [userInput, setUserInput] = useState("");

  // Simuliamo input utente per testare CodeQL
  useEffect(() => {
    const nameFromQuery = new URLSearchParams(window.location.search).get("name");
    if (nameFromQuery) {
      setUserInput(nameFromQuery);
    }
  }, []);

  return (
    <div>
      <h5>Your Hero Squad</h5>
      <ul className="list-group">
        {props.heroes.map(hero => {
          return (
            <li key={hero.id} className="list-group-item">
              {/* BUG XSS rilevabile: userInput controllato dall'utente */}
              <span dangerouslySetInnerHTML={{ __html: userInput }} />
              <div
                onClick={() => props.removeCharacterById(hero.id)}
                className="d-inline float-right right-btn"
              >
                x
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  heroes: state.heroes
});

export default connect(
  mapStateToProps,
  { removeCharacterById }
)(HeroList);
