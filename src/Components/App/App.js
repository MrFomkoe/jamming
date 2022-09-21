import React from "react";
import "./App.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { NewPlaylist } from "../NewPlaylist/NewPlaylist";
import { UserPlaylists } from "../UserPlaylists/UserPlaylists";
import { SwitchPlaylistBtn } from "../SwitchPlaylistBtn/SwitchPlaylistBtn";
import Spotify from "../../util/Spotify";

class App extends React.Component {
    constructor(props) {
        super(props);

        // State
        this.state = {
            // Spotify API token
            spotifyAccessToken: Spotify.getAccessToken(),

            // Spotify search results
            searchResults: [],

            // Creation of new playlist
            playlistName: "",
            playlistTracks: [],

            // User's already saved playlists
            userPlaylists: [],
            showUserPlaylists: false,
            userTracks: [],
            userId: null,
            currentPlaylistId: null,
        };

        // Binds
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.createNewPlaylist = this.createNewPlaylist.bind(this);
        this.search = this.search.bind(this);
        this.switchPlaylist = this.switchPlaylist.bind(this);
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
        this.showPlaylist = this.showPlaylist.bind(this);
        this.getPlaylistInfo = this.getPlaylistInfo.bind(this);

        this.updateTracklist = this.updateTracklist.bind(this);
    }

    // Function to get existing user's playlists via API
    getUserPlaylists() {
        Spotify.getUsersPlaylists().then((searchResults) => {
            this.setState({ userPlaylists: searchResults });
        });
    }

    // Function to receive and update information on playlist contents
    getPlaylistInfo(tracks, playlist) {
        this.setState({
            userTracks: tracks,
            currentPlaylistId: !playlist ? null : playlist.id,
            userId: !playlist ? null : playlist.owner.id,
        });
    }

    // Function to switch between new playlist and existing playlist
    switchPlaylist(action) {
        this.setState({ showUserPlaylists: action });
        this.getUserPlaylists();
    }



    // Function to add tracks to playlists
    addTrack(track) {
        let tracks;

        // Check for existing playlists
        if (this.state.showUserPlaylists) {
            if (this.state.userTracks.length === 0) return;
            tracks = this.state.userTracks.map((track) => {
                return track;
            });
            // Check for new playlist
        } else {
            tracks = this.state.playlistTracks.map((track) => {
                return track;
            });
        }

        // Check if the track is already in playlist, if it is - it won't be added
        if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
            return;
        }

        // Adding track
        tracks.push(track);

        // If existing playlist - it will instantly upload it via API
        if (this.state.showUserPlaylists) {
            let userId = this.state.userId;
            let playlistId = this.state.currentPlaylistId;
            let trackURIs = [track.uri];
            Spotify.postTracks(userId, playlistId, trackURIs);
            this.updateTracklist("userTracks", tracks);
        
        // If new playlist - it will update array
        } else {
            this.updateTracklist("playlistTracks", tracks);
        }
    }

    removeTrack(track) {
        let tracks;
        // Check for existing playlists
        if (this.state.showUserPlaylists) {
            tracks = this.state.userTracks;
        // Check for new playlist
        } else {
            tracks = this.state.playlistTracks;
        }

        // Filter function to remove track
        tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);

        // If existing playlist - it will delete track via API
        if (this.state.showUserPlaylists) {
            this.updateTracklist("userTracks", tracks);
            let userId = this.state.userId;
            let playlistId = this.state.currentPlaylistId;
            let trackURIs = [track.uri];
            Spotify.deleteTracks(userId, playlistId, trackURIs);
        
        // If new playlist - it will update array
        } else {
            this.updateTracklist("playlistTracks", tracks);
        }
    }

    // Function to update tracklist
    updateTracklist(keyUsed, tracks) {
        this.setState({ [keyUsed]: tracks });
    }

    // Function to update playlist name for new playlist
    updatePlaylistName(listName) {
        this.setState({ playlistName: listName });
    }

    // Function to create new playlist via API 
    createNewPlaylist() {
        let trackURIs = [];
        for (let track of this.state.playlistTracks) {
            trackURIs.push(track.uri);
        }
        Spotify.createNewPlaylist(this.state.playlistName, trackURIs).then(
            () => {
                this.setState({
                    playlistName: "",
                    playlistTracks: [],
                });
            }
        );
    }

    // Function to search for tracks via API
    search(term) {
        Spotify.search(term).then((searchResults) => {
            this.setState({ searchResults: searchResults });
        });
    }

    // Function to render either new playlist or existing playlist
    showPlaylist() {
        let isLoading = this.state.userPlaylists === null ? true : false;

        if (this.state.showUserPlaylists === true && !isLoading) {
            return (
                <UserPlaylists
                    userPlaylists={this.state.userPlaylists}
                    userTracks={this.state.userTracks}
                    onAdd={this.addTrack}
                    onRemove={this.removeTrack}
                    onPlaylistLoaded={this.getPlaylistInfo}
                    onPlaylistUnLoaded={[
                        this.getUserPlaylists,
                        this.getPlaylistInfo,
                    ]}
                />
            );
        } else {
            return (
                <NewPlaylist
                    playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks}
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlaylistName}
                    onSave={this.createNewPlaylist}
                />
            );
        }
    }

    render() {
        return (
            <div>
                <h1>
                    Ja<span className="highlight">mmm</span>ing
                </h1>
                <div className="App">
                    <SearchBar onSearch={this.search} />

                    <SwitchPlaylistBtn
                        myPlaylists={this.state.showUserPlaylists}
                        onSwitchPlaylist={this.switchPlaylist}
                    />

                    <div className="App-playlist">
                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack}
                        />

                        {this.showPlaylist()}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
