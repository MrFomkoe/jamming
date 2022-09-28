import React from "react";
import './Player.css'


export class Player extends React.Component {
  render() {
    return (
      <iframe title="iFrame" className="Track-player" src={`https://open.spotify.com/embed/track/${this.props.track.id}?utm_source=generator`} ></iframe>
    );
  }
}