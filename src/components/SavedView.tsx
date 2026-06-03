import type { BaseLineName } from '../types';
import type { SavedStation } from '../hooks/useSavedStations';
import { LINE_CONFIG } from '../config/lines';

import redline_stations from '../data/redline';
import greenline_stations from '../data/greenline';
import purpleline_stations from '../data/purpleline';

const allLineStations = { red: redline_stations, green: greenline_stations, purple: purpleline_stations };

type Props = {
  saved: SavedStation[];
  onToggleSaved: (line: BaseLineName, name: string) => void;
  onNavigateTo: (line: BaseLineName, name: string) => void;
  selectedLine: BaseLineName;
};

function StarFilledIcon({ color }: { color: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.45 9.05 8.5z"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

export default function SavedView({ saved, onToggleSaved, onNavigateTo, selectedLine }: Props) {
  const line = LINE_CONFIG[selectedLine];

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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', opacity: 0.85 }}>SAVED STATIONS</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, lineHeight: 1, letterSpacing: '-0.6px' }}>Pinned</div>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        {saved.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12, color: 'var(--text-sub)' }}>
            <div style={{ color: 'var(--text-faint)' }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                <path d="M12 2.5l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.45 9.05 8.5z"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, textAlign: 'center', maxWidth: 200, lineHeight: 1.5 }}>
              Star a station on the Now tab to pin it here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {saved.map((s) => {
              const sc = LINE_CONFIG[s.line];
              const stations = allLineStations[s.line];
              const station = stations.find((st) => st.name === s.stationName);
              const shortLabel = s.stationName.split('/')[0];

              return (
                <div
                  key={s.line + s.stationName}
                  style={{
                    background: 'var(--surface)',
                    borderRadius: 18,
                    padding: '16px 18px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: `inset 5px 0 0 ${sc.color}`,
                  }}
                >
                  {/* Line badge */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: sc.color,
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
                    flexShrink: 0,
                  }}>
                    {sc.short[0]}
                  </div>

                  {/* Station info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {shortLabel}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: sc.color, fontWeight: 600 }}>{sc.name}</span>
                      {station?.bike_parking && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M5.5 17.5L10 8h4l4 9.5M10 8l-1.5-3H7"/></svg>
                          Bike rack
                        </span>
                      )}
                    </div>
                    {station?.nearby && station.nearby.length > 0 && (
                      <div style={{ fontSize: 11.5, color: 'var(--text-sub)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <PinIcon />
                        {station.nearby.slice(0, 2).join(' · ')}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <button
                      onClick={() => onToggleSaved(s.line, s.stationName)}
                      style={{ background: 'none', border: 'none', padding: 4, color: sc.color }}
                    >
                      <StarFilledIcon color={sc.color} />
                    </button>
                    <button
                      onClick={() => onNavigateTo(s.line, s.stationName)}
                      style={{ background: 'none', border: 'none', padding: 4, color: 'var(--text-dim)' }}
                    >
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {saved.length > 0 && (
          <div style={{ padding: '18px 4px 16px', color: 'rgba(0,0,0,0.35)', fontSize: 12, textAlign: 'center' }}>
            Tap the star to unpin · Arrow to jump to arrivals
          </div>
        )}
      </div>
    </div>
  );
}
