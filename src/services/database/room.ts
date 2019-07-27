import { query } from '.';
import { randomStringGenerator } from '../../actions/room';

/**
 * Return a random room code that is not in the database.
 *
 * Uses 4 digit codes.
 *
 * (r + n - 1)! / (r! * (n - 1)!)
 * (4 + 33 - 1)! / (4! * (33 - 1)!)
 * (36)! / (4! * (32)!)
 * 58905
 */
export async function generateRoomCode() {
  for (const code of randomStringGenerator(4)) {
    const rows = await query(
      `
      SELECT room_code
      FROM playlist
      WHERE room_code = $1
    `,
      [code]
    );

    if (rows.length === 0) {
      return code;
    }
  }
}
