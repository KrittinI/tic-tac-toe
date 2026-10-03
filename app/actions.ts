"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);

    revalidatePath("/users");
  } catch (error) {
    console.error("Failed to create user:", error);
  }
}
