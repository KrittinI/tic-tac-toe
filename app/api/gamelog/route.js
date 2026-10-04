import { pool } from "@/config/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { playerId, winner, game_log } = await req.json();

    if (!playerId || !["X", "O", "-"].includes(winner)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO gamelogs (user_id, winner, game_log)
    VALUES ($1,$2,$3)`,
      [playerId, winner, game_log]
    );

    return NextResponse.json({
      message: "Game log created successfully",
      game_log: result.rows[0],
    });
  } catch (error) {
    console.error("Create game log error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
