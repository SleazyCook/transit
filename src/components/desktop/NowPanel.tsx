import { LINE_CONFIG } from '../../config/lines';
import { useArrivals, etaSec } from '../../hooks/useArrivals';
import HSchematic from '../HSchematic';
import type { BaseLineName, LineName, LineResult } from '../../types';

type Props = {
  selectedLine: BaseLineName;
  nearestStations: Record<LineName, LineResult> | null;
  isSaved: (line: BaseLineName, name: string) => boolean;
  onToggleSaved: (line: BaseLineName, name: string) => void;
};

function WalkIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 22V12M12 12l-3 4M12 12l3 4M9 9l-3 3M15 9l3 3" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.45 9.05 8.5z" />
    </svg>
  );
}

export default function NowPanel({ selectedLine, nearestStations, isSaved, onToggleSaved }: Props) {
  const {
    loading,
    allSorted,
    countdown,
    nextDirLabel,
    stationName,
    walkTime,
    stationIdx,
    stations,
  } = useArrivals(selectedLine, nearestStations);

  const line = LINE_CONFIG[selectedLine];
  const isStationSaved = isSaved(selectedLine, stationName);

  return (
    <div style={{
      height: '100%',
      background: '#F6F3EE',
      overflowY: 'auto',
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#161512',
    }}>
      <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: '100%', boxSizing: 'border-box' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: line.color,
                color: '#fff',
                borderRadius: 6,
                padding: '3px 9px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                flexShrink: 0,
              }}>
                {line.short} LINE
              </span>
              {walkTime !== null && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 13, color: 'rgba(22,21,18,0.5)', fontWeight: 500,
                }}>
                  <WalkIcon /> {walkTime} min from you
                </span>
              )}
            </div>
            <div style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {stationName}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', marginTop: 22 }}>
            <button
              onClick={() => onToggleSaved(selectedLine, stationName)}
              style={{
                background: isStationSaved ? line.color : '#fff',
                color: isStationSaved ? '#fff' : '#161512',
                border: `1px solid ${isStationSaved ? line.color : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 9,
                padding: '7px 9px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              <StarIcon filled={isStationSaved} />
            </button>
            <button
              style={{
                background: '#161512',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'default',
                letterSpacing: '0.1px',
              }}
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Two-up grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flexShrink: 0 }}>

          {/* Hero card */}
          <div style={{
            background: line.color,
            borderRadius: 18,
            padding: '20px 22px 22px',
            color: '#fff',
            position: 'relative',
            minHeight: 210,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* LIVE pill */}
            <div style={{
              position: 'absolute', top: 16, right: 16,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 10px', borderRadius: 999,
              fontSize: 10.5, fontWeight: 600, letterSpacing: '0.4px',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999,
                background: '#7BFFB3',
                boxShadow: '0 0 8px #7BFFB3',
                display: 'inline-block',
              }} />
              LIVE
            </div>

            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: '1px',
              opacity: 0.75, marginBottom: 'auto', paddingTop: 2,
            }}>
              NEXT TRAIN{nextDirLabel ? ` · ${nextDirLabel.toUpperCase()}` : ''}
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 80,
                fontWeight: 500,
                lineHeight: 0.9,
                letterSpacing: '-3px',
              }}>
                {loading ? '–' : countdown.big}
              </div>
              {!loading && countdown.small && (
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 17,
                  fontWeight: 500,
                  opacity: 0.85,
                  marginTop: 10,
                  letterSpacing: '-0.5px',
                }}>
                  {countdown.small}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming card */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            padding: '16px 18px',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: '1px',
              color: 'rgba(0,0,0,0.4)', marginBottom: 10,
            }}>
              UPCOMING
            </div>
            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}>
                Loading…
              </div>
            ) : allSorted.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}>
                No upcoming arrivals.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {allSorted.slice(0, 4).map((a, i) => {
                  const sec = etaSec(a.ArrivalTime);
                  const dirLabel = a.dir === 'd1' ? line.direction1 : line.direction2;
                  return (
                    <div
                      key={a.ArrivalId + a.dir}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 0',
                        borderBottom: i < Math.min(allSorted.length, 4) - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 999, background: line.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#161512' }}>{dirLabel}</span>
                      </div>
                      <div style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: '#161512',
                      }}>
                        {sec < 30 ? 'Due' : Math.round(sec / 60) + ' min'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Schematic card */}
        <div style={{
          background: '#fff',
          borderRadius: 18,
          padding: '16px 20px 20px',
          border: '1px solid rgba(0,0,0,0.05)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.4)' }}>
              LIVE POSITION
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              color: 'rgba(0,0,0,0.35)',
            }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          {stationIdx >= 0 ? (
            <div style={{ overflow: 'hidden' }}>
              <HSchematic
                stations={stations}
                currentIdx={stationIdx}
                lineColor={line.color}
                variant="light"
                width={360}
              />
            </div>
          ) : (
            <div style={{ height: 72, display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}>
              Station position unavailable.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
