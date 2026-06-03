import { LINE_CONFIG } from '../../config/lines';
import type { BaseLineName, LineName, LineResult } from '../../types';

type Props = {
  selectedLine: BaseLineName;
  nearestStations: Record<LineName, LineResult> | null;
};

function PinIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h-3l-3 7.5h9l-3-7.5zM9 6l3 7.5M7 10h5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function lineKeyForName(name: string): BaseLineName | null {
  for (const [key, cfg] of Object.entries(LINE_CONFIG)) {
    if (cfg.name === name) return key as BaseLineName;
  }
  return null;
}

export default function ContextRail({ selectedLine, nearestStations }: Props) {
  const currentStation = nearestStations ? nearestStations[selectedLine].station : null;
  const nearby = currentStation?.nearby ?? [];
  const connections = currentStation?.connections ?? [];

  return (
    <div style={{
      height: '100%',
      borderLeft: '1px solid rgba(0,0,0,0.06)',
      background: '#FAF8F3',
      overflowY: 'auto',
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#161512',
    }}>
      <div style={{ padding: '24px 16px 24px' }}>

        {/* NEARBY */}
        {nearby.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.4)', marginBottom: 10 }}>
              NEARBY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {nearby.slice(0, 6).map((place, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 4px',
                    borderBottom: i < Math.min(nearby.length, 6) - 1
                      ? '1px dashed rgba(0,0,0,0.08)'
                      : 'none',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    color: 'rgba(22,21,18,0.5)',
                  }}>
                    <PinIcon />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {place}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(22,21,18,0.4)', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>
                      ~{2 + i * 2} min walk
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STATION FACTS */}
        {currentStation && (
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.4)', marginBottom: 10 }}>
              STATION FACTS
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              {currentStation.bike_parking && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <span style={{ color: 'rgba(22,21,18,0.45)', flexShrink: 0 }}><BikeIcon /></span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Bike parking available</span>
                </div>
              )}
              {currentStation.address && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <span style={{ color: 'rgba(22,21,18,0.45)', flexShrink: 0, marginTop: 1 }}><MapPinIcon /></span>
                  <a
                    href={currentStation.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 13, fontWeight: 500, color: '#161512',
                      textDecoration: 'none', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    } as React.CSSProperties}
                  >
                    View on maps
                  </a>
                </div>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
              }}>
                <span style={{ color: 'rgba(22,21,18,0.45)', flexShrink: 0 }}><ClockIcon /></span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>~8 min avg headway</span>
              </div>
            </div>
          </section>
        )}

        {/* CONNECTIONS */}
        {connections.length > 0 && (
          <section>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.4)', marginBottom: 10 }}>
              CONNECTIONS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {connections.map((connName) => {
                const key = lineKeyForName(connName);
                const cfg = key ? LINE_CONFIG[key] : null;
                return (
                  <div
                    key={connName}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '7px 12px',
                      borderRadius: 999,
                      background: cfg ? cfg.tint : 'rgba(0,0,0,0.05)',
                      color: cfg ? cfg.dark : '#161512',
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    <div style={{
                      width: 7, height: 7, borderRadius: 999,
                      background: cfg ? cfg.color : '#888',
                      flexShrink: 0,
                    }} />
                    {connName}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!currentStation && (
          <div style={{ color: 'rgba(0,0,0,0.35)', fontSize: 13, lineHeight: 1.5 }}>
            Waiting for your location to load station details…
          </div>
        )}

      </div>
    </div>
  );
}
