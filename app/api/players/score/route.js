import { pool } from "@/config/database";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { playerId, scoreChange, steak } = await req.json();

    if (
      !playerId ||
      !Number.isInteger(scoreChange) ||
      ![2, 1, -1].includes(scoreChange)
    ) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE players
       SET score = score + $1,
       steak = $2
       WHERE id = $3
       RETURNING id, name, score`,
      [scoreChange, steak, playerId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Score updated successfully",
      player: result.rows[0],
    });
  } catch (error) {
    console.error("Update score error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
