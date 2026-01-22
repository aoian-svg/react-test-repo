import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const SquadStats = props => {
  const { heroes } = props;

  const getTotalFor = attribute =>
    heroes.reduce((total, hero) => total + hero[attribute], 0);

  return (
    <div>
      <h5>Squad Stats</h5>
      <ul className="list-group">
        <li className="list-group-item">
          <b>Overall Strength: </b> {getTotalFor("strength")}
        </li>
        <li className="list-group-item">
          <b>Overall Intelligence: </b> {getTotalFor("intelligence")}
        </li>
        <li className="list-group-item">
          <b>Overall Speed: </b> {getTotalFor("speed")}
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    heroes: state.heroes
  };
};

SquadStats.propTypes = {
  heroes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      strength: PropTypes.number.isRequired,
      intelligence: PropTypes.number.isRequired,
      speed: PropTypes.number.isRequired
    })
  ).isRequired
};

export default connect(mapStateToProps)(SquadStats);
