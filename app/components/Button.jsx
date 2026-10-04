"use client";
export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-25 bg-blue-500 text-white py-2 rounded h-10 cursor-pointer hover:underline hover:bg-blue-600"
    >
      {text}
    </button>
  );
}
