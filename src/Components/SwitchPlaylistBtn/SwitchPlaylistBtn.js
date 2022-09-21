import React from "react";
import "./SwitchPlaylistBtn.css";

export class SwitchPlaylistBtn extends React.Component {
    constructor(props) {
        super(props);

        this.switchPlaylist = this.switchPlaylist.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let showUserPlaylists = this.props.myPlaylists;
        this.props.myPlaylists
            ? (showUserPlaylists = false)
            : (showUserPlaylists = true);
        this.props.onSwitchPlaylist(showUserPlaylists);
    }

    switchPlaylist() {
        if (this.props.myPlaylists) {
            return <button className="SwitchPlaylistBtn">NEW PLAYLIST</button>;
        } else {
            return <button className="SwitchPlaylistBtn">MY PLAYLISTS</button>;
        }
    }

    render() {
        return (
            <div className="Switch">
                <button
                    className="SwitchPlaylistBtn"
                    onClick={this.handleClick}
                >
                    {this.props.myPlaylists ? "NEW PLAYLIST" : "MY PLAYLISTS"}
                </button>
            </div>
        );
    }
}
