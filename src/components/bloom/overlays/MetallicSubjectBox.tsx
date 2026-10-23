import React, { useState } from "react";
export function MetallicSubjectBox({ subject, onEdit }: { subject: string, onEdit: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      onClick={() => { if(!isEditing) onEdit ? onEdit() : setIsEditing(true); }}
      className="w-[238px] h-[150px] flex items-center justify-center cursor-pointer group relative z-30"
      style={{ 
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        backgroundImage: "url(/assets/polaroid-defaults/lace_oval.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-[173px] flex items-center justify-center text-center">
        {isEditing ? (
          <textarea
            autoFocus
            value={subject}
            onChange={() => {}}
            onBlur={() => setIsEditing(false)}
            className="w-full bg-transparent border-none outline-none text-center resize-none"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, fontSize: "22px", lineHeight: "26px", color: "#FF0000" }}
          />
        ) : (
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, fontSize: "22px", lineHeight: "26px", color: "#FF0000" }}>
            {subject || "I am really sorry!!!"}
          </span>
        )}
      </div>
    </div>
  );
}
