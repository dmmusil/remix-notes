import { Link } from "@remix-run/react";
import { useState } from "react";

export default function NoteIndexPage() {
  const [count, setCount] = useState(0);

  const handleClick = (dir: "up" | "down"): void => {
    if (dir === "up") setCount(count + 1);
    else setCount(count - 1);
  };

  return (
    <>
      <p>
        No note selected. Select a note on the left, or{" "}
        <Link to="new" className="text-blue-500 underline">
          create a new note.
        </Link>
      </p>
      <p>
        {count}

        <button
          onClick={() => handleClick("up")}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          +
        </button>
        <button
          onClick={() => handleClick("down")}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          -
        </button>
      </p>
    </>
  );
}
