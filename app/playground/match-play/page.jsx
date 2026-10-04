"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import Button from "../../components/Button";

export default function MatchRoomPage() {
  const { data: session, status, update } = useSession();

  const router = useRouter();

  const [table, setTable] = useState(["", "", "", "", "", "", "", "", ""]);
  // by default player is X
  const [turn, setTurn] = useState("X");
  const [result, setResult] = useState("");
  const [winner, setWinner] = useState("");
  const [logPlay, setLogPlay] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleClickTable = (index) => {
    if (result) {
      return;
    }
    if (table[index]) {
      return;
    }
    setTable((prev) => {
      prev[index] = turn;
      return [...prev];
    });
    setLogPlay((prev) => [...prev, index]);
    if (turn === "X") {
      setTurn("O");
    } else {
      setTurn("X");
    }
  };

  const handleNewGame = async () => {
    setTable(["", "", "", "", "", "", "", "", ""]);
    setTurn("X");
    setResult("");
    setWinner("");
    setLogPlay([]);
    setIsSaved(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateresult = (table) => {
    let winner = "";
    winner = validateHorizonal(table);
    if (winner) {
      return;
    }
    winner = validateDiagonal(table);
    if (winner) {
      return;
    }
    winner = validateVertical(table);

    if (winner) {
      return;
    }

    if (table.every((block) => block !== "")) {
      setResult("Draw");
      setWinner("-");
      return;
    }
  };

  const validateHorizonal = (table) => {
    for (let i = 0; i < 3; i++) {
      if (
        table[i * 3] === table[1 + i * 3] &&
        table[i * 3] === table[2 + i * 3] &&
        table[i * 3] !== ""
      ) {
        setResult(table[i * 3] + " is winner!!");
        setWinner(table[i * 3]);

        break;
      }
    }
  };

  const validateVertical = (table) => {
    for (let i = 0; i < 3; i++) {
      if (
        table[i] === table[3 + i] &&
        table[i] === table[6 + i] &&
        table[i] !== ""
      ) {
        setResult(table[i] + " is winner!!");
        setWinner(table[i]);
        break;
      }
    }
  };

  const validateDiagonal = (table) => {
    if (table[0] === table[4] && table[0] === table[8] && table[0] !== "") {
      setResult(table[0] + " is winner!!");
      setWinner(table[0]);

      return;
    }
    if (table[2] === table[4] && table[2] === table[6] && table[2] !== "") {
      setResult(table[2] + " is winner!!");
      setWinner(table[2]);

      return;
    }
  };

  const saveAndUpdateScore = async () => {
    if (!winner || isSaved) return;

    const isWin = winner === "X";
    let scoreChange = isWin ? 1 : -1;
    let steak = session?.user?.steak ?? 0;

    if (isWin) {
      if (steak === 2) {
        scoreChange++;
        steak = 0;
      } else {
        steak++;
      }
    } else {
      steak = 0;
    }

    try {
      const scoreRes = await fetch("/api/players/score", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: session?.user?.id,
          scoreChange,
          steak,
        }),
      });

      if (!scoreRes.ok) {
        throw new Error("Failed to update score");
      }

      const logRes = await fetch("/api/gamelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: session?.user?.id,
          winner,
          game_log: logPlay,
        }),
      });

      if (!logRes.ok) {
        throw new Error("Failed to save game log");
      }

      await update();
      setIsSaved(true);
    } catch (error) {
      console.error("Save game error:", error);
    }
  };

  const handleQuitRoom = () => {
    router.push(`/playground`);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    validateresult(table);
  }, [table, validateresult]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (!isSaved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      saveAndUpdateScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, isSaved]);

  return (
    <div className="px-4 py-2">
      <header className="flex justify-between items-center shadow-2xs mb-2 pb-2">
        <h1 className="text-3xl font-bold">MatchRoomPage</h1>
        <div className="flex gap-2 items-center">
          <p className="whitespace-nowrap">
            Player Name: {session?.user?.name}
          </p>
          <p className="whitespace-nowrap">Score: {session?.user?.score}</p>
          <p className="whitespace-nowrap">Steak: {session?.user?.steak}</p>
        </div>
      </header>
      <div className="min-h-full mx-auto w-full">
        <p className="w-full text-center mb-2 text-2xl">&nbsp;{result}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            {!result && turn === "X" && "Turn Player X"}
          </div>
          <div className="grid grid-cols-3 w-72">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center border-gray-400
          ${i < 3 ? "border-t" : ""}
          ${i % 3 === 0 ? "border-l" : ""}
          border-r border-b`}
                onClick={() => handleClickTable(i)}
              >
                {table[i]}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center flex-1">
            {!result && turn === "O" && "Turn Player O"}
          </div>
        </div>
        <div className="w-full flex justify-center gap-2 mt-2">
          <Button onClick={handleNewGame} text={"New Game"} />
          <Button onClick={handleQuitRoom} text={"Quit Room"} />
        </div>
      </div>
    </div>
  );
}
