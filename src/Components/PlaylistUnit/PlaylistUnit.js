import React from "react";
import "./PlaylistUnit.css";

import Spotify from "../../util/Spotify";

export class PlaylistUnit extends React.Component {
    constructor(props) {
        super(props);

        // Binds
        this.collapsePlaylist = this.collapsePlaylist.bind(this);
    }

    collapsePlaylist() {
        let userId = this.props.playlist.owner.id;
        let playlistId = this.props.playlist.id;
        Spotify.getTracks(userId, playlistId).then((tracks) => {
            this.props.onCollapse(tracks, this.props.playlist);
        });
    }


    render() {
        return (
            <div className="Playlist-unit" onClick={this.collapsePlaylist}>
                <div className="Playlist-information">
                    <h3> {this.props.playlist.name} </h3>
                    <p> Total tracks: {this.props.playlist.tracks.total} </p>
                </div>
            </div>
        );
    }
}
