import React from "react";

export default function Loader({ small }) {
  return (
    <div className={`flex items-center justify-center ${small ? "py-4" : "py-24"}`}>
      <div
        className={`border-4 border-gray-200 border-t-ember rounded-full animate-spin ${
          small ? "w-6 h-6" : "w-12 h-12"
        }`}
      />
    </div>
  );
}
