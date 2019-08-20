CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET TIME ZONE 'UTC';

CREATE TYPE music_service AS ENUM (
  'spotify'
);

CREATE TABLE request (
  request_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_date timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX request_request_id_idx ON request (request_id);

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

CREATE TABLE user_service (
  user_service_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id uuid NOT NULL REFERENCES user_profile(user_profile_id),
  service music_service NOT NULL,
  service_user_data jsonb NOT NULL
);
CREATE INDEX user_service_user_service_id_idx ON user_service (user_service_id);
CREATE INDEX user_service_user_profile_id_idx ON user_service (user_profile_id);

CREATE TABLE user_auth (
  user_auth_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_service_id uuid NOT NULL REFERENCES user_service(user_service_id),
  token text NOT NULL,
  token_type text NOT NULL,
  refresh_token text NOT NULL,
  created_date timestamptz NOT NULL DEFAULT now(),
  expires_in integer NOT NULL
);

CREATE INDEX user_auth_user_auth_id_idx ON user_auth (user_auth_id);
CREATE INDEX user_auth_user_service_id_idx ON user_auth (user_service_id);

CREATE OR REPLACE FUNCTION generate_unique_playlist_code(arg_length integer) 
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
      WHERE playlist_code = generated_code
    ) INTO is_unique;
    EXIT WHEN is_unique;
  END LOOP;

  RETURN generated_code;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TABLE playlist (
  playlist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_auth_id uuid NOT NULL REFERENCES user_auth(user_auth_id),
  playlist_name text NOT NULL,
  playlist_code text UNIQUE NOT NULL,
  service_playlist_data jsonb NOT NULL,
  created_date timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX playlist_playlist_id_idx ON playlist (playlist_id);
CREATE INDEX playlist_user_auth_id_idx ON playlist (user_auth_id);
CREATE INDEX playlist_playlist_code_idx ON playlist (playlist_code);

CREATE TABLE playlist_setting (
  playlist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4()
);

CREATE TABLE playlist_setting_voting (
  voting_enabled boolean NOT NULL DEFAULT false,
  voting_time_secs integer NOT NULL DEFAULT 30
) INHERITS (playlist_setting);


CREATE TABLE track (
  track_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id uuid NOT NULL REFERENCES playlist(playlist_id),
  service_track_data jsonb NOT NULL,
  created_date timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE track_vote (
  vote_up_count integer NOT NULL DEFAULT 0,
  vote_down_count integer NOT NULL DEFAULT 0
) INHERITS (track);
