CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET TIME ZONE 'UTC';

-- Login

CREATE TABLE auth_request (
  auth_request_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_date timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_request_auth_request_id_idx ON auth_request (auth_request_id);

-- User

CREATE TABLE user_profile (
  user_profile_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL
);
CREATE INDEX user_profile_user_profile_id_idx ON user_profile (user_profile_id);

CREATE TABLE user_token (
  user_token_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id uuid NOT NULL REFERENCES user_profile(user_profile_id),
  refresh_token text NOT NULL,
  created_date timestamptz NOT NULL DEFAULT now(),
  expiry_date timestamptz NOT NULL
);
CREATE INDEX user_token_user_profile_id_idx ON user_token (user_profile_id);

-- External Service

CREATE TABLE external_account (
  external_account_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id uuid REFERENCES user_profile(user_profile_id)
);
CREATE INDEX external_account_user_profile_id_idx ON external_account (user_profile_id);

CREATE TABLE external_token (
  external_token_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_account_id uuid NOT NULL REFERENCES external_account(external_account_id)
);
CREATE INDEX external_token_external_account_id_idx ON external_token (external_account_id);

-- Spotify Service

CREATE TABLE spotify_account (
  spotify_id text NOT NULL UNIQUE
) INHERITS (external_account);
-- CREATE INDEX spotify_account_spotify_id_idx ON spotify_account (spotify_id);

CREATE TABLE spotify_token (
  token_type text NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  created_date timestamptz NOT NULL DEFAULT now(),
  expiry_date timestamptz NOT NULL
) INHERITS (external_token);

-- Playlist

CREATE OR REPLACE FUNCTION generate_unique_playlist_code(arg_length integer DEFAULT 4) 
  RETURNS text
AS $$
DECLARE
  characters CONSTANT text = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  generated_code text;
  is_unique boolean;
BEGIN
  LOOP
    -- Generate a random string of characters
    SELECT array_to_string(array_agg(substring(characters from trunc(random() * length(characters) + 1)::integer for 1)), '')
      INTO generated_code
    FROM generate_series(1, arg_length);

    -- Check to make sure the code is unique
    SELECT NOT EXISTS(
      SELECT true
      FROM playlist
      WHERE code = generated_code
    ) INTO is_unique;
    EXIT WHEN is_unique;
  END LOOP;

  RETURN generated_code;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TABLE playlist (
  playlist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_token_id uuid NOT NULL REFERENCES external_token(external_token_id),
  code text NOT NULL UNIQUE DEFAULT generate_unique_playlist_code(),
  created_date timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX playlist_external_token_id_idx ON playlist (external_token_id);

CREATE TABLE track (
  track_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id uuid NOT NULL REFERENCES playlist(playlist_id),
  created_date timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX track_playlist_id_idx ON playlist (playlist_id);

-- Spotify Track

CREATE TABLE spotify_track (
  spotify_track_id text NOT NULL
) INHERITS (track);
