CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET TIME ZONE 'UTC';

CREATE TYPE music_service AS ENUM (
  'spotify'
);

CREATE TABLE auth (
  auth_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service music_service NOT NULL,
  token text NOT NULL,
  token_type text NOT NULL,
  refresh_token text NOT NULL,
  expiry_date timestamptz NOT NULL
);

CREATE TABLE playlist (
  playlist_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid NOT NULL REFERENCES auth(auth_id),
  room_code text
);
