let accessToken;
const clientId = "d7098bdda6014626914b59bd9a76c1a8";
// const redirectUri = "https://romansjamming.surge.sh/";
const redirectUri = "http://localhost:3000";

let Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } else {
            const accessTokenMatch =
                window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch =
                window.location.href.match(/expires_in=([^&]*)/);

            if (accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                const expiresIn = Number(expiresInMatch[1]);

                // This clears the parametrs, allowing us to grab a new access token when it expires.
                window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
                window.history.pushState("Access Token", null, "/");
            } else {
                const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
                window.location = accessUrl;
            }
        }
    },

    // Get user ID
    async getUserId() {
        accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        const userEndpoint = "https://api.spotify.com/v1/me";

        let response = await fetch(userEndpoint, { headers: headers });
        let jsonResponse = await response.json();
        userId = jsonResponse.id;
        return userId;
    },

    // Search via SpotifyAPI
    search(term) {
        if (!term) {
            return;
        }
        accessToken = Spotify.getAccessToken();
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        const headers = { Authorization: `Bearer ${accessToken}` };
        return fetch(endpoint, {
            headers: headers,
        })
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                const tracks = jsonResponse.tracks.items.map((track) => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                }));
                return tracks;
            });
    },

    // Creation of new playlist
    async createNewPlaylist(playListName, trackURIs) {
        if (!playListName || !trackURIs.length) {
            console.log("no data provided");
            return;
        }
        try {
            // Checking if access token is valid
            accessToken = Spotify.getAccessToken();
            // Headers for API auth
            const headers = { Authorization: `Bearer ${accessToken}` };
            // Getting userId
            let userId = await this.getUserId();
            // Creating new playlist
            const newPlaylistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
            let response = await fetch(newPlaylistEndpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ name: playListName }),
            });
            // Retrieving new playlist's data and posting tracks
            let jsonResponse = await response.json();
            let playlistId = jsonResponse.id;
            this.postTracks(userId, playlistId, trackURIs);
        } catch (error) {
            console.log(error);
        }
    },

    // Post tracks to playlist
    async postTracks(userId, playlistId, trackURIs) {
        try {
            accessToken = Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
            await fetch(playlistEndpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ uris: trackURIs }),
            });
        } catch (error) {
            console.log(error);
        }
    },

    async deleteTracks(userId, playlistId, trackURIs) {
        try {
            accessToken = Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
            await fetch(playlistEndpoint, {
                method: "DELETE",
                headers: headers,
                body: JSON.stringify({ uris: trackURIs }),
            });
        } catch (error) {
            console.log(error);
        }
    },

    async getUsersPlaylists() {
        try {
            accessToken = Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            let userId = await Spotify.getUserId();
            
            const usersPlaylistsEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists?limit=20`;
            let response = await fetch(usersPlaylistsEndpoint, {
                headers: headers,
            });
            let jsonResponse = await response.json();
            
            let userPlaylists = jsonResponse.items.filter((currentPlaylist) => {
                return currentPlaylist.owner.id === userId;
            })
            return userPlaylists;
        } catch (error) {
            console.log(error);
        }
    },

    async getTracks(userId, playlistId) {
        try {
            accessToken = Spotify.getAccessToken();
            const headers = { Authorization: `Bearer ${accessToken}` };
            const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
            let response = await fetch(playlistEndpoint, {
                headers: headers,
            });
            let jsonResponse = await response.json();
            let nextPage = jsonResponse.next;
            let trackList = [];

            function pushTracks() {
                for (let i = 0; i < jsonResponse.items.length; i++) {
                    let track = jsonResponse.items[i].track;
                    trackList.push({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                    });
                }
            }

            if (nextPage === null) {
                pushTracks();
            } else {
                pushTracks();
                while (nextPage !== null) {
                    response = await fetch(nextPage, {
                        headers: headers,
                    });
                    jsonResponse = await response.json();
                    pushTracks();
                    nextPage = jsonResponse.next;
                }
            }

            return trackList;
        } catch (error) {
            console.log(error);
        }
    },
};

export default Spotify;
