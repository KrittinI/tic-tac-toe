import bcrypt from "bcrypt";
import { pool } from "../../../../config/database";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO PLAYERS (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    return Response.json({ message: "User created", user: rows[0] });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "User could not be created" });
  }
}
