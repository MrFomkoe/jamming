import React from "react";
import { TrackList } from "../TrackList/TrackList";
import "./NewPlaylist.css";

export class NewPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input
                    value={this.props.playlistName}
                    onChange={this.handleNameChange}
                    type="text"
                    placeholder="New Playlist"
                />
                <TrackList
                    tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true}
                    renderPlayer={false}
                />
                <button className="Playlist-save" onClick={this.props.onSave}>
                    SAVE TO SPOTIFY
                </button>
            </div>
        );
    }
}
