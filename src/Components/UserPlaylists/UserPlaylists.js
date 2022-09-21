import React from "react";
import "./UserPlaylists.css";
import { PlaylistUnit } from "../PlaylistUnit/PlaylistUnit";
import { TrackList } from "../TrackList/TrackList";

export class UserPlaylists extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playlistCollapsed: false,
            currentPlaylistName: "",
        };

        // Binds
        this.collapsePlaylist = this.collapsePlaylist.bind(this);
        this.unCollaplsePlaylist = this.unCollaplsePlaylist.bind(this);
    }

    renderAction() {
        let isLoading =
            this.props.userTracks === null ? true : false;

        if (!isLoading && this.state.playlistCollapsed) {
            

            return (
                <div className="Playlist-current">
                    <div className="Playlist-current-info">
                        <h2> {this.state.currentPlaylistName} </h2>
                        <button onClick={this.unCollaplsePlaylist}> ↶ </button>
                    </div>
                    <TrackList
                        tracks={this.props.userTracks}
                        isRemoval={true}
                        renderPlayer={false}
                        collapsed={this.state.playlistCollapsed}
                        onRemove={this.props.onRemove}
                    />
                </div>
            );
        } else if (!this.state.playlistCollapsed) {
            return (
                <div className="Playlist-users-list">
                    <h2> My playlists </h2>
                    {this.props.userPlaylists.map((playlist) => {
                        return (
                            <PlaylistUnit
                                playlist={playlist}
                                key={playlist.id}
                                onCollapse={this.collapsePlaylist}
                                onAdd={this.props.onAdd}
                            />
                        );
                    })}
                </div>
            );
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.userTracks !== prevProps.userTracks) {
    //         console.log('difference')
    //     }
    // }

    collapsePlaylist(tracks, playlist) {
        this.setState({
            playlistCollapsed: true,
            currentPlaylistName: playlist.name,
        });
        this.props.onPlaylistLoaded(tracks, playlist);
    }

    unCollaplsePlaylist() {
        this.setState({
            playlistCollapsed: false,
            currentPlaylistName: "",
        });
        this.props.onPlaylistUnLoaded[0]();
        this.props.onPlaylistUnLoaded[1]([], null)
    }



    render() {
        return <div className="Playlist">{this.renderAction()}</div>;
    }
}
