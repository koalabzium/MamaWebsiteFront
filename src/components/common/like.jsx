import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";

export class Like extends Component {
  render() {
    const { liked, onClickToggle } = this.props;
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
  }
}

Like.PropTypes = {
  liked: PropTypes.bool.isRequired,
  onClickToggle: PropTypes.func.isRequired
};

export default Like;
