import { SPOTIFY_API_URL } from '../../../const';
import { spotifyFetch } from '../fetch';
import { getSpotifyPlaylistTracks } from '../playlist/getPlaylistTracks';

interface GetSongRecommendationsParameters {
  playlistId: string;
  token: string;
  tokenType: string;
}

export async function getSongRecommendations(
  args: GetSongRecommendationsParameters
) {
  // GET first 100 songs of playlist
  const playlistTracks = await getSpotifyPlaylistTracks({
    token: args.token,
    tokenType: args.tokenType,
    playlistId: args.playlistId,
    offset: 0,
    limit: 100
  });

  // Create array of just uris
  const trackURIs = playlistTracks.items.map((track) => {
    return track.track.id;
  });

  // GET audio features for trackURIs
  const featuresURL = new URL(`${SPOTIFY_API_URL}/audio-features`);
  featuresURL.searchParams.append('ids', String(trackURIs));
  const featuresResult = await spotifyFetch(featuresURL.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`,
      'Content-Type': 'application/json'
    }
  });
  const features = await featuresResult.json();

  // Average the audio features
  const featuresAverage = features.audio_features.reduce(
    (sum: any, feature: any) => {
      return {
        acousticness: (sum.acousticness + feature.acousticness) / 2,
        danceability: (sum.danceability + feature.danceability) / 2,
        energy: (sum.energy + feature.energy) / 2,
        instrumentalness: (sum.instrumentalness + feature.instrumentalness) / 2,
        liveness: (sum.liveness + feature.liveness) / 2,
        loudness: (sum.loudness + feature.loudness) / 2,
        speechiness: (sum.speechiness + feature.speechiness) / 2,
        tempo: (sum.tempo + feature.tempo) / 2,
        valence: (sum.valence + feature.valence) / 2
      };
    },
    {
      acousticness: features.audio_features[0].acousticness,
      danceability: features.audio_features[0].danceability,
      energy: features.audio_features[0].energy,
      instrumentalness: features.audio_features[0].instrumentalness,
      liveness: features.audio_features[0].liveness,
      loudness: features.audio_features[0].loudness,
      speechiness: features.audio_features[0].speechiness,
      tempo: features.audio_features[0].tempo,
      valence: features.audio_features[0].valence
    }
  );

  /**
   * Pick 5 random tracks to seed the recommendation.
   * This should also allow each person viewing to get a different seed of recommendations,
   * allowing for everyone to see different recommendations each time. Should allow for more
   * recommendations overall (in theory).
   */
  const seedTrackUris = [
    trackURIs[Math.floor(Math.random() * trackURIs.length)],
    trackURIs[Math.floor(Math.random() * trackURIs.length)],
    trackURIs[Math.floor(Math.random() * trackURIs.length)],
    trackURIs[Math.floor(Math.random() * trackURIs.length)],
    trackURIs[Math.floor(Math.random() * trackURIs.length)]
  ];

  // GET 20 song recommendations based on seed tracks, and average audio features
  const recomendationsURL = new URL(`${SPOTIFY_API_URL}/recommendations`);
  recomendationsURL.searchParams.append('seed_tracks', String(seedTrackUris));
  recomendationsURL.searchParams.append(
    'target_acousticness',
    String(featuresAverage.acousticness)
  );
  recomendationsURL.searchParams.append(
    'target_danceability',
    String(featuresAverage.danceability)
  );
  recomendationsURL.searchParams.append(
    'target_energy',
    String(featuresAverage.energy)
  );
  recomendationsURL.searchParams.append(
    'target_instrumentalness',
    String(featuresAverage.instrumentalness)
  );
  recomendationsURL.searchParams.append(
    'target_liveness',
    String(featuresAverage.liveness)
  );
  recomendationsURL.searchParams.append(
    'target_loudness',
    String(featuresAverage.loudness)
  );
  recomendationsURL.searchParams.append(
    'target_speechiness',
    String(featuresAverage.speechiness)
  );
  recomendationsURL.searchParams.append(
    'target_tempo',
    String(featuresAverage.tempo)
  );
  recomendationsURL.searchParams.append(
    'target_valence',
    String(featuresAverage.valence)
  );
  const recommendationsResult = await spotifyFetch(recomendationsURL.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`,
      'Content-Type': 'application/json'
    }
  });
  const recommendations = await recommendationsResult.json();

  return recommendations.tracks;
}
