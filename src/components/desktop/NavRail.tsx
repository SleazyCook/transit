import { LINE_CONFIG } from '../../config/lines';
import { allLineStations } from '../../hooks/useArrivals';
import type { BaseLineName } from '../../types';
import type { SavedStation } from '../../hooks/useSavedStations';

type Props = {
  selectedLine: BaseLineName;
  onLineChange: (line: BaseLineName) => void;
  saved: SavedStation[];
  isSaved: (line: BaseLineName, name: string) => boolean;
  onPickSaved: (line: BaseLineName, name: string) => void;
  onSettingsClick: () => void;
};

function SearchIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function StarFilled() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.45 9.05 8.5z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}

const LINE_ORDER: BaseLineName[] = ['red', 'green', 'purple'];

export default function NavRail({ selectedLine, onLineChange, saved, onPickSaved, onSettingsClick }: Props) {
  return (
    <div style={{
      height: '100%',
      borderRight: '1px solid var(--border)',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{ padding: '20px 14px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px',
            flexShrink: 0,
          }}>
            M
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            Metro
          </span>
        </div>

        {/* Search — TODO: wire up station filtering */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--hover)',
          borderRadius: 10, padding: '8px 12px',
          marginBottom: 22,
          color: 'var(--text-dim)',
        }}>
          <SearchIcon />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Search stations</span>
        </div>

        {/* LINES */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'var(--text-sub)', marginBottom: 6, padding: '0 4px' }}>
            LINES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {LINE_ORDER.map((key) => {
              const cfg = LINE_CONFIG[key];
              const active = key === selectedLine;
              const count = allLineStations[key].length;
              return (
                <button
                  key={key}
                  onClick={() => onLineChange(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: active ? cfg.color : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 9, height: 9, borderRadius: 999,
                    background: active ? '#fff' : cfg.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: active ? '#fff' : 'var(--text)' }}>
                    {cfg.name}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    fontWeight: 500,
                    color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SAVED */}
        {saved.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'var(--text-sub)', marginBottom: 6, padding: '0 4px' }}>
              SAVED
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {saved.map((s) => {
                const cfg = LINE_CONFIG[s.line];
                const isActive = s.line === selectedLine;
                const chipLabel = s.stationName.split('/')[0].split(' ').slice(0, 3).join(' ');
                return (
                  <button
                    key={s.line + s.stationName}
                    onClick={() => onPickSaved(s.line, s.stationName)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: isActive ? 'var(--hover)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: 999,
                      background: cfg.color,
                      flexShrink: 0,
                    }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chipLabel}
                    </span>
                    <span style={{ color: cfg.color, flexShrink: 0 }}>
                      <StarFilled />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Alert card */}
        <div style={{
          background: 'var(--hover)',
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
          marginBottom: 12,
        }}>
          <span style={{ color: 'var(--text-sub)', marginTop: 1, flexShrink: 0 }}>
            <BellIcon />
          </span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>1 alert</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-sub)', lineHeight: 1.4 }}>
              Minor delays expected on Green Line today.
            </div>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '10px 12px', borderRadius: 10,
            background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            color: 'var(--text-sub)',
          }}
        >
          <GearIcon />
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>Settings</span>
        </button>

      </div>
    </div>
  );
}
