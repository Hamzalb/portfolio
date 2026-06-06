/**
 * Bridges @react-three/fiber v8 JSX types into React 19's React.JSX namespace.
 *
 * R3F v8 augments the legacy global `JSX.IntrinsicElements`, but @types/react v19
 * moved the namespace to `React.JSX.IntrinsicElements`. This file re-augments the
 * React module so that <mesh>, <planeGeometry>, etc. are valid JSX elements.
 */
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
