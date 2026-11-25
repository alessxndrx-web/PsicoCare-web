import type { CSSProperties } from "react";
import { ISOTYPE, ISOTYPE_STROKES, LOGO_VIEWBOX, WORDMARK } from "./logo-geometry";
import { NeuralAwakeningController } from "./NeuralAwakeningController";
import "./neural-awakening.css";

/**
 * Neural Awakening: the official Psico Care logo "comes alive" as a neural network.
 *
 * Everything visible here is the official vector logo (public/brand/logo-light.svg) at its own
 * geometry and colours: the isotype's four strokes are traced by impulses, nodes fire where the
 * impulses pass, the original filled isotype settles in, then the original wordmark letters.
 * The timeline is pure CSS, so it ends on its own even if hydration fails; the controller only adds
 * skipping and the flight into the navbar logo. It is rendered hidden and only shown when the inline
 * boot script marks <html data-intro="play">, which never happens without JavaScript.
 */

type Stroke = { delay: number; duration: number };
// Timings in ms. The big outer stroke starts first; the inner knot joins in as the impulse arrives.
const STROKES: Stroke[] = [
  { delay: 380, duration: 300 }, // small leaf
  { delay: 300, duration: 420 }, // inner spiral
  { delay: 320, duration: 500 }, // central knot
  { delay: 240, duration: 620 }, // outer petals
];
// Points sampled on each stroke with getPointAtLength (k/6 of its length), in the logo's viewBox.
const NODE_POINTS: [number, number][][] = [
  [[633.4, 736.5], [684.1, 716.9], [721.9, 677.8], [720.6, 628.9]],
  [[688.2, 495.4], [748.6, 405.7], [755.8, 489.6], [822.2, 419.2], [767.3, 317.4], [672.7, 376.3]],
  [[857.5, 580.2], [938.5, 436.6], [754.7, 510.5], [705.3, 492.5], [812.9, 677.9], [928.6, 689.1]],
  [[618, 735.7], [786.1, 706.4], [817.4, 337.3], [943.1, 685.6], [551.5, 644.6], [520.8, 474.3]],
];
const NODES = NODE_POINTS.flatMap((points, s) => points.map(([cx, cy], k) => ({
  cx, cy, delay: Math.round(STROKES[s].delay - 120 + STROKES[s].duration * k / 6),
})));
const ISOTYPE_CENTER = { cx: 743.5, cy: 550 };
const matrix = (t: readonly number[]) => `matrix(1,0,0,-1,${t[0]},${t[1]})`;
const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function NeuralAwakening() {
  return <div className="neural-intro" data-neural-intro style={{ display: "none" }}>
    <div className="ni-backdrop" aria-hidden="true"/>
    <div className="ni-stage" aria-hidden="true">
      <div className="ni-logo">
        <svg className="ni-svg" viewBox={LOGO_VIEWBOX} width="940" height="520" focusable="false">
          <defs><radialGradient id="ni-pulse-glow"><stop offset="0" stopColor="#d9edf6" stopOpacity=".9"/><stop offset=".35" stopColor="#a2aae8" stopOpacity=".45"/><stop offset="1" stopColor="#804bdd" stopOpacity="0"/></radialGradient></defs>
          <circle className="ni-pulse" cx={ISOTYPE_CENTER.cx} cy={ISOTYPE_CENTER.cy} r="120" fill="url(#ni-pulse-glow)"/>
          <g className="ni-strokes" transform={matrix(ISOTYPE.t)}>
            {ISOTYPE_STROKES.map((d, i) => <g key={i} style={vars({ "--d": STROKES[i].delay + "ms", "--dur": STROKES[i].duration + "ms" })}>
              <path className="ni-trace" d={d} pathLength={1}/>
              <path className="ni-spark" d={d} pathLength={1}/>
            </g>)}
          </g>
          <path className="ni-iso" transform={matrix(ISOTYPE.t)} d={ISOTYPE.d} fill="#d9edf6"/>
          <g className="ni-nodes">
            {NODES.map((n, i) => <circle key={i} className="ni-node" cx={n.cx} cy={n.cy} r="9" style={vars({ "--d": Math.max(0, n.delay) + "ms" })}/>)}
          </g>
          <g className="ni-word">
            {WORDMARK.map((letter, i) => <g key={i} className="ni-letter" style={vars({ "--i": i })}>
              <path transform={matrix(letter.t)} d={letter.d} fill="#d9edf6"/>
            </g>)}
          </g>
        </svg>
      </div>
      <p className="ni-tagline"><span>El futuro del bienestar emocional.</span></p>
    </div>
    <button type="button" className="ni-skip" data-intro-skip>Omitir introducción</button>
    <NeuralAwakeningController/>
  </div>;
}
