CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET TIME ZONE 'UTC';

CREATE TYPE music_service AS ENUM (
  'spotify'
);

CREATE TABLE request (
  request_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_date timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth (
  auth_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service music_service NOT NULL,
  token text NOT NULL,
  token_type text NOT NULL,
  refresh_token text NOT NULL,
  expiry_date timestamptz NOT NULL
);

CREATE OR REPLACE FUNCTION generate_unique_room_code(arg_length integer) 
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
      FROM room
      WHERE room_code = generated_code
    ) INTO is_unique;
    EXIT WHEN is_unique;
  END LOOP;

  RETURN generated_code;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TABLE room (
  room_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid NOT NULL REFERENCES auth(auth_id),
  room_code text UNIQUE NOT NULL,
  service_playlist_id text NOT NULL
);
