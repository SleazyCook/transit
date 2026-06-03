import { useState } from 'react';
import type { BaseLineName } from '../types';
import { LINE_CONFIG } from '../config/lines';
import { useTheme, type Theme } from '../context/ThemeContext';

const THEME_OPTIONS: Theme[] = ['Light', 'Dark', 'Auto'];

type Props = {
  selectedLine: BaseLineName;
};

type ToggleSetting = {
  kind: 'toggle';
  label: string;
  sub?: string;
  defaultOn: boolean;
};

type SegmentSetting = {
  kind: 'segment';
  label: string;
  options: string[];
  defaultIdx: number;
};

type Setting = ToggleSetting | SegmentSetting;

type Section = {
  head: string;
  items: Setting[];
};

const SECTIONS: Section[] = [
  {
    head: 'Appearance',
    items: [
      { kind: 'segment', label: 'Theme', options: ['Light', 'Dark', 'Auto'], defaultIdx: 0 },
      { kind: 'toggle', label: 'High contrast', sub: 'Bolder text and outlines', defaultOn: false },
      { kind: 'toggle', label: 'Larger text', sub: 'Across all screens', defaultOn: false },
    ],
  },
  {
    head: 'Units & format',
    items: [
      { kind: 'segment', label: 'Distance', options: ['Miles', 'KM'], defaultIdx: 0 },
      { kind: 'segment', label: 'Clock', options: ['12h', '24h'], defaultIdx: 0 },
    ],
  },
  {
    head: 'Alerts',
    items: [
      { kind: 'toggle', label: 'Service disruptions', sub: 'Push when your line is delayed', defaultOn: true },
      { kind: 'toggle', label: 'Saved-station arrivals', sub: 'Notify 5 min before pickup', defaultOn: false },
    ],
  },
];

function Toggle({ on, color, onToggle }: { on: boolean; color: string; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 26, borderRadius: 999,
        background: on ? color : 'var(--toggle-off)',
        border: 'none', padding: 0, cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: 999,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }}/>
    </button>
  );
}

function Segment({ options, selectedIdx, color, onSelect }: { options: string[]; selectedIdx: number; color: string; onSelect: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', padding: 3, background: 'var(--segment-track)', borderRadius: 10, flexShrink: 0 }}>
      {options.map((o, i) => (
        <button
          key={o}
          onClick={() => onSelect(i)}
          style={{
            padding: '5px 13px', borderRadius: 7,
            background: i === selectedIdx ? 'var(--segment-pill)' : 'transparent',
            color: i === selectedIdx ? color : 'var(--text-sub)',
            fontSize: 12, fontWeight: 600,
            border: 'none',
            boxShadow: i === selectedIdx ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function SettingsView({ selectedLine }: Props) {
  const line = LINE_CONFIG[selectedLine];
  const { theme, setTheme } = useTheme();

  // Local state for each setting
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTIONS.forEach((s) => {
      s.items.forEach((it) => {
        if (it.kind === 'toggle') init[it.label] = it.defaultOn;
      });
    });
    return init;
  });

  const [segmentState, setSegmentState] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    SECTIONS.forEach((s) => {
      s.items.forEach((it) => {
        if (it.kind === 'segment') init[it.label] = it.defaultIdx;
      });
    });
    init['Theme'] = THEME_OPTIONS.indexOf(theme);
    return init;
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      fontFamily: 'Space Grotesk, sans-serif',
      color: 'var(--text)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ background: line.color, color: '#fff', paddingBottom: 22, flexShrink: 0 }}>
        <div style={{ height: 44, padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: 15, fontWeight: 600 }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', opacity: 0.85 }}>SETTINGS</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, lineHeight: 1, letterSpacing: '-0.6px' }}>Preferences</div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px' }}>
        {SECTIONS.map((sec) => (
          <div key={sec.head} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.4px', color: 'var(--text-sub)', padding: '6px 8px 8px' }}>
              {sec.head}
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {sec.items.map((it, i) => (
                <div
                  key={it.label}
                  style={{
                    padding: '13px 16px',
                    borderBottom: i === sec.items.length - 1 ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{it.label}</div>
                    {it.kind === 'toggle' && it.sub && (
                      <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>{it.sub}</div>
                    )}
                  </div>
                  {it.kind === 'toggle' && (
                    <Toggle
                      on={toggleState[it.label] ?? it.defaultOn}
                      color={line.color}
                      onToggle={() => setToggleState((prev) => ({ ...prev, [it.label]: !prev[it.label] }))}
                    />
                  )}
                  {it.kind === 'segment' && (
                    <Segment
                      options={it.options}
                      selectedIdx={it.label === 'Theme' ? THEME_OPTIONS.indexOf(theme) : (segmentState[it.label] ?? it.defaultIdx)}
                      color={line.color}
                      onSelect={(idx) => {
                        setSegmentState((prev) => ({ ...prev, [it.label]: idx }));
                        if (it.label === 'Theme') setTheme(THEME_OPTIONS[idx]);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Version info */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px', color: 'var(--text-dim)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
          Metro · Houston Light Rail · v1.0
        </div>
      </div>
    </div>
  );
}
