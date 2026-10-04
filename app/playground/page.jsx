"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function PlaygroundPage() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated") {
      const fetchPlayers = async () => {
        try {
          const res = await fetch("/api/players");

          if (!res.ok) {
            throw new Error("Failed to fetch players");
          }

          const data = await res.json();
          setPlayers(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchPlayers();
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-4 py-2">
      <header className="flex justify-between items-center shadow-2xs mb-2 pb-2">
        <h1 className="text-3xl font-bold">PlaygroundPage</h1>
        <div className="flex gap-2 items-center">
          <p className="whitespace-nowrap">
            Player Name: {session?.user?.name}
          </p>
          <p className="whitespace-nowrap">Score: {session?.user?.score}</p>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            text={"Logout"}
          />
        </div>
      </header>
      <div className="flex gap-2">
        <div>
          <Button
            onClick={() => router.push(`/playground/match-play`)}
            text={"Play Game"}
          />
        </div>

        <div>
          <h2 className="text-2xl underline pb-2">Players</h2>

          {loading ? (
            <p>Loading players...</p>
          ) : (
            <table className="border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2">ID.</th>
                  <th className="border border-black p-2">Player Name</th>
                  <th className="border border-black p-2">Email</th>
                  <th className="border border-black p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="border border-black p-2">{player.id}</td>
                    <td className="border border-black p-2">{player.name}</td>
                    <td className="border border-black p-2">{player.email}</td>
                    <td className="border border-black p-2">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
