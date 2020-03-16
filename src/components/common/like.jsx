import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

export class Like extends Component {
  render() {
    let heartClass = emptyHeart;
    if (this.props.liked) {
      heartClass = fullHeart;
    }
    return (
      <React.Fragment>
        <FontAwesomeIcon
          onClick={this.props.onClickToggle}
          icon={heartClass}
          style={{ cursor: "pointer" }}
        />
      </React.Fragment>
    );
  }
}

export default Like;
