import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="fixed pointer-events-none -z-5 hidden md:block"
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
        width: 300,
        height: 300,
        background: "radial-gradient(circle, hsla(262,83%,63%,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        transition: "left 0.1s ease-out, top 0.1s ease-out",
        zIndex: 9999,
      }}
    />
  );
};

export default CursorGlow;
