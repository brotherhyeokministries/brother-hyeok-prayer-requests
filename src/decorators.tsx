import * as React from "react";

export default function GlobalDecorator({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        * {
          box-sizing: border-box;
        }
        *::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
        }
      `}</style>
      {children}
    </>
  );
}
