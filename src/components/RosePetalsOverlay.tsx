import React, { useMemo } from 'react';

export const RosePetalsOverlay: React.FC = () => {
  // Generate stable random petals
  const petals = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.sin(i) * 10 + 5) % 95}%`,
      delay: `${(i * 1.3) % 12}s`,
      duration: `${14 + (i % 7) * 3}s`,
      size: 14 + (i % 5) * 4,
      rotation: (i * 47) % 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-0 opacity-0"
          style={{
            left: petal.left,
            animation: `petalFall ${petal.duration} linear infinite`,
            animationDelay: petal.delay,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-rose-400/40 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]"
          >
            <path
              d="M12 2C7 2 3 7 3 12C3 17 8 21 12 22C16 21 21 17 21 12C21 7 17 2 12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
