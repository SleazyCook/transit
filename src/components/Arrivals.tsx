import { useState, useEffect, useCallback } from 'react';
import type { BaseLineName, LineName, LineResult, Station } from '../types';
import { LINE_CONFIG } from '../config/lines';
import type { SavedStation } from '../hooks/useSavedStations';

import redline_stations from '../data/redline';
import greenline_stations from '../data/greenline';
import purpleline_stations from '../data/purpleline';

const MIN_REFRESH_MS = 5000;

const routeMap: Record<BaseLineName, string> = {
  red: 'Ho414_4620_700',
  green: 'Ho414_4620_800',
  purple: 'Ho414_4620_900',
};

const burnettStops = {
  direction1: 'Ho414_4620_25033',
  direction2: 'Ho414_4620_25034',
};

const allLineStations: Record<BaseLineName, Station[]> = {
  red: redline_stations,
  green: greenline_stations,
  purple: purpleline_stations,
};

type ArrivalEntry = { ArrivalId: string; ArrivalTime: string };
type ArrivalsData = { direction1: ArrivalEntry[]; direction2: ArrivalEntry[] };

type Props = {
  nearestStations: Record<LineName, LineResult> | null;
  selectedLine: BaseLineName;
  onLineChange: (line: BaseLineName) => void;
  isSaved: (line: BaseLineName, name: string) => boolean;
  onToggleSaved: (line: BaseLineName, name: string) => void;
  saved: SavedStation[];
  onPickSaved: (line: BaseLineName, name: string) => void;
};

function etaSec(arrivalTime: string) {
  return Math.max(0, Math.floor((new Date(arrivalTime).getTime() - Date.now()) / 1000));
}

function fmtEta(sec: number) {
  if (sec < 30) return 'Due';
  if (sec < 90) return 'Arriving';
  return Math.round(sec / 60) + ' min';
}

function fmtCountdown(sec: number) {
  if (sec < 30) return { big: 'DUE', small: '' };
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return { big: String(m), small: `MIN ${s}s` };
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.55l-5.9 3.12 1.13-6.57L2.45 9.45 9.05 8.5z"/>
    </svg>
  );
}

function LocIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h13l-3-3M20 17H7l3 3"/>
    </svg>
  );
}

function HSchematic({
  stations,
  currentIdx,
  lineColor,
}: {
  stations: Station[];
  currentIdx: number;
  lineColor: string;
}) {
  const range = 3;
  const start = Math.max(0, Math.min(stations.length - 7, currentIdx - range));
  const visible = stations.slice(start, start + 7);
  const width = 340;
  const height = 72;
  const stepX = visible.length > 1 ? width / (visible.length - 1) : width / 2;
  const y = height / 2;

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <line x1="0" y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
      <line x1="0" y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeDasharray="6 6"/>
      {visible.map((s, i) => {
        const x = i * stepX;
        const isCurrent = start + i === currentIdx;
        const shortLabel = s.name.split('/')[0].split(' ').slice(0, 2).join(' ');
        return (
          <g key={s.name + i}>
            <circle
              cx={x} cy={y}
              r={isCurrent ? 10 : 5}
              fill={isCurrent ? '#fff' : 'rgba(255,255,255,0.45)'}
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={isCurrent ? 3 : 2}
            />
            {isCurrent && <circle cx={x} cy={y} r={4} fill={lineColor}/>}
            <text
              x={x}
              y={isCurrent ? y - 17 : y + 21}
              textAnchor="middle"
              fontSize={isCurrent ? 11 : 9}
              fontWeight={isCurrent ? 700 : 500}
              fontFamily="Space Grotesk, sans-serif"
              fill={isCurrent ? '#fff' : 'rgba(255,255,255,0.6)'}
            >
              {shortLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ArrivalsScreen({
  nearestStations,
  selectedLine,
  onLineChange,
  isSaved,
  onToggleSaved,
  saved,
  onPickSaved,
}: Props) {
  const [arrivals, setArrivals] = useState<ArrivalsData>({ direction1: [], direction2: [] });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Tick every second to update countdowns
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const stationName = nearestStations
    ? nearestStations[selectedLine].station.name
    : 'Burnett Transit Center / Casa de Amigos';

  const walkTime = nearestStations
    ? nearestStations[selectedLine].walkTime
    : null;

  const currentStation = nearestStations
    ? nearestStations[selectedLine].station
    : null;

  const stations = allLineStations[selectedLine];
  const stationIdx = stations.findIndex((s) => s.name === stationName);

  const fetchArrivals = useCallback(async () => {
    setLoading(true);
    try {
      let stop1: string;
      let stop2: string;
      let routeId: string;

      if (!nearestStations) {
        stop1 = burnettStops.direction1;
        stop2 = burnettStops.direction2;
        routeId = routeMap.red;
      } else {
        const station = nearestStations[selectedLine].station;
        if (!station.direction_1_id || !station.direction_2_id) {
          throw new Error('Station missing stop IDs');
        }
        stop1 = station.direction_1_id;
        stop2 = station.direction_2_id;
        routeId = routeMap[selectedLine];
      }

      const res = await fetch(
        `/.netlify/functions/arrivals?stop1=${stop1}&stop2=${stop2}&routeId=${routeId}`
      );
      const data: ArrivalsData = await res.json();
      setArrivals(data);

      const allTimes = [...data.direction1, ...data.direction2].map((a) =>
        new Date(a.ArrivalTime).getTime()
      );
      const nextRefresh =
        allTimes.length > 0
          ? Math.max(Math.min(...allTimes) - Date.now(), MIN_REFRESH_MS)
          : 15000;
      setTimeout(fetchArrivals, nextRefresh);
    } catch {
      setTimeout(fetchArrivals, 60000);
    } finally {
      setLoading(false);
    }
  }, [selectedLine, nearestStations]);

  useEffect(() => {
    fetchArrivals();
  }, [fetchArrivals]);

  const line = LINE_CONFIG[selectedLine];

  // Build sorted upcoming list
  const allSorted = [
    ...arrivals.direction1.map((a) => ({ ...a, dir: 'd1' as const })),
    ...arrivals.direction2.map((a) => ({ ...a, dir: 'd2' as const })),
  ].sort((a, b) => new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime());

  // Next train
  const next = allSorted[0];
  const nextSec = next ? etaSec(next.ArrivalTime) : 0;
  void tick; // consumed to trigger re-render each second

  const countdown = fmtCountdown(nextSec);
  const nextDirLabel = next
    ? next.dir === 'd1'
      ? line.direction1
      : line.direction2
    : '';

  const isStationSaved = isSaved(selectedLine, stationName);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#F6F3EE',
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#161512',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ── Hero (line-colored) ── */}
      <div style={{ background: line.color, color: '#fff', paddingBottom: 16, flexShrink: 0 }}>

        {/* Status row */}
        <div style={{
          height: 44,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.3px',
        }}>
          <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Line selector dots */}
            {(['red', 'green', 'purple'] as BaseLineName[]).map((k) => (
              <button
                key={k}
                onClick={() => onLineChange(k)}
                style={{
                  width: k === selectedLine ? 22 : 16,
                  height: k === selectedLine ? 22 : 16,
                  borderRadius: 999,
                  background: k === selectedLine ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {k === selectedLine && (
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: line.color }}/>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Nearest + LIVE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, opacity: 0.85, letterSpacing: '0.5px' }}>
            <LocIcon />
            <span>NEAREST{walkTime ? ` · ${walkTime} MIN WALK` : ''}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.15)',
            fontSize: 11.5, fontWeight: 600, letterSpacing: '0.4px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#7BFFB3', boxShadow: '0 0 8px #7BFFB3' }}/>
            LIVE
          </div>
        </div>

        {/* Saved chips */}
        {saved.length > 0 && (
          <div style={{
            display: 'flex', gap: 8, padding: '0 20px 10px',
            overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap',
          }}>
            {saved.map((s) => {
              const sl = allLineStations[s.line].find((st) => st.name === s.stationName);
              const sc = LINE_CONFIG[s.line];
              const isActive = s.line === selectedLine && s.stationName === stationName;
              const chipLabel = s.stationName.split('/')[0].split(' ').slice(0, 2).join(' ');
              return (
                <button
                  key={s.line + s.stationName}
                  onClick={() => onPickSaved(s.line, s.stationName)}
                  style={{
                    flex: '0 0 auto',
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 13px 7px 9px', borderRadius: 999,
                    background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: '#fff',
                    fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', opacity: sl ? 1 : 0.5 }}/>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                    <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500, letterSpacing: '0.5px' }}>{sc.short}</span>
                    <span>{chipLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Station name + line tag + star */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: '1.2px', opacity: 0.9 }}>
            <span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.18)', borderRadius: 4 }}>
              {line.short} LINE
            </span>
            <span>·</span>
            <span>STATION</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.5px', maxWidth: 260 }}>
              {stationName}
            </div>
            <button
              onClick={() => onToggleSaved(selectedLine, stationName)}
              style={{ color: '#fff', background: 'none', border: 'none', padding: 4, marginTop: 2 }}
            >
              <StarIcon filled={isStationSaved} />
            </button>
          </div>
        </div>

        {/* Big countdown */}
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 80, fontWeight: 500, lineHeight: 0.9, letterSpacing: '-3px' }}>
            {loading ? '–' : countdown.big}
          </div>
          {!loading && countdown.small && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingBottom: 6 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 19, fontWeight: 500, opacity: 0.85, letterSpacing: '-0.3px' }}>
                {countdown.small}
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.8px', opacity: 0.75, marginTop: 4 }}>
                NEXT · {nextDirLabel.toUpperCase()}
              </div>
            </div>
          )}
          {!loading && !countdown.small && next && (
            <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.8px', opacity: 0.75, paddingBottom: 6 }}>
              · {nextDirLabel.toUpperCase()}
            </div>
          )}
        </div>

        {/* Horizontal schematic */}
        {stationIdx >= 0 && (
          <div style={{ padding: '14px 20px 0', overflow: 'hidden' }}>
            <HSchematic
              stations={stations}
              currentIdx={stationIdx}
              lineColor={line.color}
            />
          </div>
        )}
      </div>

      {/* ── Upcoming list ── */}
      <div style={{ flex: 1, padding: '16px 16px 0', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, color: 'rgba(0,0,0,0.4)', fontSize: 14, fontWeight: 500 }}>
            Loading arrivals…
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.45)' }}>UPCOMING</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <SwapIcon /> BOTH WAYS
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allSorted.length === 0 && (
                <div style={{ padding: '20px 4px', color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
                  No upcoming arrivals.
                </div>
              )}
              {allSorted.slice(0, 5).map((a, i) => {
                const sec = etaSec(a.ArrivalTime);
                const dirLabel = a.dir === 'd1' ? line.direction1 : line.direction2;
                const terminus = a.dir === 'd1' ? line.terminus1 : line.terminus2;
                const isFirst = i === 0;
                return (
                  <div
                    key={a.ArrivalId + a.dir}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: isFirst
                        ? `inset 4px 0 0 ${line.color}`
                        : `inset 3px 0 0 ${line.color}40`,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: line.color }}>
                        {dirLabel.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#161512' }}>
                        to {terminus}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500, color: '#161512', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 26, letterSpacing: '-0.5px' }}>
                        {sec < 30 ? '·' : Math.round(sec / 60)}
                      </span>
                      <span style={{ fontSize: 11.5, opacity: 0.6 }}>
                        {fmtEta(sec) === 'Due' ? 'DUE' : fmtEta(sec) === 'Arriving' ? '· arriving' : 'min'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nearby places */}
            {currentStation?.nearby && currentStation.nearby.length > 0 && (
              <div style={{ marginTop: 16, padding: '0 4px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.45)', marginBottom: 10 }}>NEARBY</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {currentStation.nearby.slice(0, 6).map((n, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '6px 12px',
                        background: '#fff',
                        borderRadius: 999,
                        border: '1px solid rgba(0,0,0,0.07)',
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: '#161512',
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
