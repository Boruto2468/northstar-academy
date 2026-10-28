'use client';

import {useEffect, useState} from 'react';
import type {Diagram as DiagramData} from '@/types/topic';

export default function Diagram({diagram}: {diagram: DiagramData}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const selected = diagram.labels[activeIndex];

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setTick(value => value >= 10 ? 0 : value + 1);
      setActiveIndex(index => (index + 1) % diagram.labels.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [diagram.labels.length, playing]);

  function step() {
    setPlaying(false);
    setTick(value => value >= 10 ? 0 : value + 1);
    setActiveIndex(index => (index + 1) % diagram.labels.length);
  }

  const active = (id: string) => selected?.id === id;
  const transition = {transition: 'fill 250ms ease, stroke 250ms ease, opacity 250ms ease'};

  return (
    <div className="diagram">
      <div className="diagram-top">
        <strong>Explore the diagram</strong>
        <div className="control-row">
          <button type="button" onClick={() => setPlaying(value => !value)} aria-pressed={playing}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={step}>Step →</button>
        </div>
      </div>
      <svg viewBox="0 0 440 240" role="img" aria-label={`${diagram.type} interactive diagram`} className="diagram-svg">
        {diagram.type === 'venn' && <>
          <defs>
            <clipPath id="venn-left"><circle cx="175" cy="119" r="90"/></clipPath>
          </defs>
          <rect x="12" y="12" width="416" height="216" rx="12" fill="#e8f1f7" stroke="#6684a3"/>
          <circle cx="175" cy="119" r="90" fill="#7e9ce3" fillOpacity={active('left') ? '.8' : '.4'} stroke="#4264b2" strokeWidth={active('left') ? 6 : 3} style={transition}/>
          <circle cx="265" cy="119" r="90" fill="#f6b973" fillOpacity={active('right') ? '.8' : '.4'} stroke="#b97836" strokeWidth={active('right') ? 6 : 3} style={transition}/>
          <circle cx="265" cy="119" r="90" fill="#9b78c5" fillOpacity={active('middle') ? '.85' : '0'} clipPath="url(#venn-left)" style={transition}/>
          <text x="125" y="125" fontSize="18">A</text>
          <text x="303" y="125" fontSize="18">B</text>
        </>}
        {diagram.type === 'cell' && <>
          <ellipse cx="220" cy="120" rx="172" ry="100" fill="#b7dfd1" stroke="#287f74" strokeWidth={active('membrane') ? 9 : 5} fillOpacity={active('cytoplasm') ? '.95' : '.7'} style={transition}/>
          <ellipse cx="220" cy="115" rx="55" ry="49" fill="#a7a0d7" stroke="#64559e" strokeWidth={active('nucleus') ? 7 : 3} style={transition}/>
          <circle cx="220" cy="115" r="17" fill="#6d5ca6" opacity={active('nucleus') ? 1 : .7} style={transition}/>
          {[0, 1, 2, 3].map(i => <ellipse key={i} cx={115 + i * 66} cy={i % 2 ? 173 : 67} rx="20" ry="9" fill="#e2a36c" stroke="#a76537" strokeWidth={active('mitochondria') ? 4 : 2} opacity={active('mitochondria') ? 1 : .7} style={transition}/>)}
        </>}
        {diagram.type === 'diffusion' && <>
          <rect x="18" y="18" width="202" height="204" rx="12" fill={active('high') ? '#cce6e6' : '#e4f3f3'} style={transition}/>
          <rect x="220" y="18" width="202" height="204" rx="12" fill={active('low') ? '#cce6e6' : '#e4f3f3'} style={transition}/>
          <path d="M220 20 V220" stroke="#398b98" strokeWidth={active('membrane') ? 13 : 8} strokeDasharray="12 8" style={transition}/>
          {Array.from({length: 24}, (_, i) => {
            const startX = i < 18 ? 35 + (i % 6) * 25 : 250 + (i % 3) * 38;
            const progress = i < 18 ? Math.min(1, Math.max(0, (tick - (i % 6)) / 5)) : 0;
            const x = startX + progress * (380 - startX);
            return <circle key={i} cx={x} cy={30 + (i * 43) % 175} r={active(x < 220 ? 'high' : 'low') ? 9 : 7} fill="#ea9370" opacity={active('membrane') ? .5 : 1} style={{transition: 'cx 1400ms ease, r 400ms ease, opacity 400ms ease'}}/>;
          })}
        </>}
        {diagram.type === 'plant' && <>
          <path d="M220 205 V76" stroke="#538f65" strokeWidth="13" strokeLinecap="round" fill="none"/>
          <path d="M220 192 Q190 210 174 226 M220 192 Q248 211 266 226 M220 202 Q220 220 220 231" stroke="#a77c51" strokeWidth="5" strokeLinecap="round" fill="none" opacity={active('roots') ? 1 : .6}/>
          <ellipse cx="110" cy="65" rx="65" ry="26" transform="rotate(-25 110 65)" fill="#86bb83" stroke={active('leaf') ? '#286d5c' : 'none'} strokeWidth="5" style={transition}/>
          <ellipse cx="330" cy="65" rx="65" ry="26" transform="rotate(25 330 65)" fill="#86bb83" stroke={active('leaf') ? '#286d5c' : 'none'} strokeWidth="5" style={transition}/>
          {[0, 1, 2].map(i => <circle key={i} cx={i === 0 ? 110 : i === 1 ? 330 : 220} cy={i === 2 ? 66 : 65} r={active('stomata') ? 6 : 3} fill="#315e50" style={transition}/>)}
          <circle cx="220" cy={205 - (tick * 13) % 125} r="7" fill="#71bfe6" style={{transition: 'cy 1400ms ease'}}/>
        </>}
        {diagram.type === 'transport' && <>
          <path d="M220 205 V65 M220 130 Q125 130 110 70 M220 130 Q315 130 330 70" stroke="#538f65" strokeWidth="16" strokeLinecap="round" fill="none"/>
          <path d="M216 199 V72" stroke={active('xylem') ? '#2580b4' : '#71bfe6'} strokeWidth={active('xylem') ? 8 : 5} strokeLinecap="round" opacity=".8" style={transition}/>
          <path d="M227 145 Q260 120 318 77" stroke={active('phloem') ? '#d58a48' : '#e5b46d'} strokeWidth={active('phloem') ? 8 : 5} strokeLinecap="round" opacity=".9" style={transition}/>
          {[0, 1, 2].map(i => <circle key={i} cx="216" cy={198 - (tick * 16 + i * 52) % 132} r="7" fill="#71bfe6" style={{transition: 'cy 1400ms ease'}}/>)}
        </>}
        {diagram.type === 'enzyme' && <>
          <path d="M110 175 Q120 120 170 120 Q185 70 220 100 Q255 70 270 120 Q320 120 330 175 Q220 215 110 175Z" fill="#9badd9" stroke="#596b9e" strokeWidth="4"/>
          <path d="M190 120 Q220 100 250 120 L240 143 Q220 155 200 143Z" fill="#faf8f2" stroke="#596b9e" strokeWidth="3"/>
          <path d={`M${tick < 5 ? 220 : 198} ${tick < 5 ? 35 + tick * 12 : 125} l-18 20 18 20 18-20z`} fill="#e9a162" stroke="#a76537" strokeWidth="3" style={{transition: 'transform 500ms ease'}}/>
        </>}
      </svg>
      <div className="diagram-labels">
        {diagram.labels.map((label, index) => (
          <button
            type="button"
            className={selected?.id === label.id ? 'selected' : ''}
            key={label.id}
            aria-pressed={selected?.id === label.id}
            onClick={() => {setActiveIndex(index); setPlaying(false);}}
          >
            {label.name}
          </button>
        ))}
      </div>
      <div className="diagram-detail" aria-live="polite">
        {selected ? <><strong>{selected.name}</strong> — {selected.description}</> : 'Tap a label to discover what it does.'}
      </div>
    </div>
  );
}
