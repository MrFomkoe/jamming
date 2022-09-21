import React from "react";
import { Player } from "../Player/Player";
import "./Track.css";

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.renderPlayer = this.renderPlayer.bind(this);
    }

    renderAction() {
        if (this.props.isRemoval) {
            return (
                <button className="Track-action" onClick={this.removeTrack}>
                    -
                </button>
            );
        } else {
            return (
                <button className="Track-action" onClick={this.addTrack}>
                    +
                </button>
            );
        }
    }

    renderPlayer() {
        if (this.props.renderPlayer) {
            return <Player track={this.props.track} />;
        } else {
            return;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3> {this.props.track.name} </h3>
                    <p>
                        {this.props.track.artist} | {this.props.track.album}
                    </p>
                    {this.renderPlayer()}
                </div>
                {this.renderAction()}
            </div>
        );
    }
}
