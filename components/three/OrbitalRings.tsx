'use client';

/**
 * OrbitalRings — pure CSS 3D perspective.
 * Uses transform-style:preserve-3d + rotateX/Y for genuine 3D depth.
 * Zero canvas, zero WebGL — GPU-composited via the browser's 3D CSS pipeline.
 */
export default function OrbitalRings() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '600px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div style={{ position: 'relative', width: 220, height: 220, transformStyle: 'preserve-3d' }}>

        {/* Core glowing sphere */}
        <div style={{
          position: 'absolute',
          inset: '50%',
          width: 52, height: 52,
          marginLeft: -26, marginTop: -26,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #818cf8, #4f46e5 60%, #312e81)',
          boxShadow: '0 0 28px 6px rgba(99,102,241,0.55), 0 0 8px 2px rgba(99,102,241,0.9)',
          animation: 'coreRotate 6s linear infinite',
        }} />

        {/* Ring 1 — indigo, tilted steeply */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.75)',
          boxShadow: '0 0 10px rgba(99,102,241,0.35)',
          animation: 'ring1spin 4s linear infinite',
          transform: 'rotateX(72deg) rotateY(15deg)',
        }}>
          {/* Bead */}
          <div style={{
            position: 'absolute', top: -4, left: '50%', marginLeft: -4,
            width: 8, height: 8, borderRadius: '50%',
            background: '#818cf8',
            boxShadow: '0 0 8px 2px rgba(129,140,248,0.9)',
          }} />
        </div>

        {/* Ring 2 — cyan, medium tilt */}
        <div style={{
          position: 'absolute',
          inset: -16,
          borderRadius: '50%',
          border: '1.5px solid rgba(6,182,212,0.65)',
          boxShadow: '0 0 8px rgba(6,182,212,0.3)',
          animation: 'ring2spin 6s linear infinite',
          transform: 'rotateX(55deg) rotateY(-30deg)',
        }}>
          <div style={{
            position: 'absolute', top: -3, left: '50%', marginLeft: -3,
            width: 6, height: 6, borderRadius: '50%',
            background: '#22d3ee',
            boxShadow: '0 0 7px 2px rgba(34,211,238,0.9)',
          }} />
        </div>

        {/* Ring 3 — violet, shallow tilt */}
        <div style={{
          position: 'absolute',
          inset: -30,
          borderRadius: '50%',
          border: '1px solid rgba(167,139,250,0.5)',
          boxShadow: '0 0 6px rgba(167,139,250,0.2)',
          animation: 'ring3spin 9s linear infinite',
          transform: 'rotateX(30deg) rotateY(60deg)',
        }}>
          <div style={{
            position: 'absolute', top: -3, left: '50%', marginLeft: -3,
            width: 5, height: 5, borderRadius: '50%',
            background: '#c084fc',
            boxShadow: '0 0 6px 2px rgba(192,132,252,0.9)',
          }} />
        </div>

        {/* Ambient glow behind sphere */}
        <div style={{
          position: 'absolute', inset: '30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }} />
      </div>

      <style>{`
        @keyframes ring1spin {
          from { transform: rotateX(72deg) rotateY(15deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes ring2spin {
          from { transform: rotateX(55deg) rotateY(-30deg) rotateZ(0deg); }
          to   { transform: rotateX(55deg) rotateY(-30deg) rotateZ(-360deg); }
        }
        @keyframes ring3spin {
          from { transform: rotateX(30deg) rotateY(60deg) rotateZ(0deg); }
          to   { transform: rotateX(30deg) rotateY(60deg) rotateZ(360deg); }
        }
        @keyframes coreRotate {
          0%   { transform: scale(1)    rotate(0deg);   box-shadow: 0 0 28px 6px rgba(99,102,241,0.55); }
          50%  { transform: scale(1.08) rotate(180deg); box-shadow: 0 0 38px 10px rgba(99,102,241,0.75); }
          100% { transform: scale(1)    rotate(360deg); box-shadow: 0 0 28px 6px rgba(99,102,241,0.55); }
        }
      `}</style>
    </div>
  );
}
