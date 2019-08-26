import { SPOTIFY_API_URL } from '../../../const';
import { spotifyFetch } from '../fetch';
import { SpotifyTokenType } from '../types';

// Interface
interface QuerySpotifyArtistParameters {
  token: string;
  tokenType: SpotifyTokenType;
  artistURI: string;
}

export async function queryArtist(args: QuerySpotifyArtistParameters) {
  const meURL = new URL(`${SPOTIFY_API_URL}/me`);
  const meResult = await spotifyFetch(meURL.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`
    }
  });
  const meJSON = await meResult.json();

  const topTenURL = new URL(
    `${SPOTIFY_API_URL}/artists/${args.artistURI}/top-tracks`
  );
  topTenURL.searchParams.append('country', meJSON.country);
  const topTenResult = await spotifyFetch(topTenURL.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`
    }
  });
  const topTenJSON = await topTenResult.json();

  const albumURL = new URL(
    `${SPOTIFY_API_URL}/artists/${args.artistURI}/albums`
  );
  albumURL.searchParams.append('market', meJSON.country);
  const albumResult = await spotifyFetch(albumURL.href, {
    method: 'GET',
    headers: {
      Authorization: `${args.tokenType} ${args.token}`
    }
  });
  const albumJSON = await albumResult.json();

  // Remove duplicate albums that have different URI's, regional data, etc...
  const albums = albumJSON.items.filter(
    (albumJSON: any, index: any, self: any) =>
      index ===
      self.findIndex(
        (album: any) =>
          album.place === albumJSON.place && album.name === albumJSON.name
      )
  );

  return {
    ...topTenJSON,
    albums
  };
}
