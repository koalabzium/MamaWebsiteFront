import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";

const Like = props => {
  const { liked, onClickToggle } = props;
  let heartClass = emptyHeart;
  if (liked) {
    heartClass = fullHeart;
  }
  return (
    <React.Fragment>
      <FontAwesomeIcon
        onClick={onClickToggle}
        icon={heartClass}
        style={{ cursor: "pointer" }}
      />
    </React.Fragment>
  );
};

Like.propTypes = {
  liked: PropTypes.bool.isRequired,
  onClickToggle: PropTypes.func.isRequired
};

export default Like;
