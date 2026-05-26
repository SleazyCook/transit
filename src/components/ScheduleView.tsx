import type { BaseLineName, LineName, LineResult } from '../types';
import { LINE_CONFIG } from '../config/lines';

type Props = {
  nearestStations: Record<LineName, LineResult> | null;
  selectedLine: BaseLineName;
  onLineChange: (line: BaseLineName) => void;
};

export default function ScheduleView({ nearestStations, selectedLine, onLineChange }: Props) {
  const line = LINE_CONFIG[selectedLine];
  const stationName = nearestStations
    ? nearestStations[selectedLine].station.name
    : 'Burnett Transit Center / Casa de Amigos';

  const days = ['Today', 'Tomorrow', 'Sat', 'Sun'];

  // Faux schedule rows — 7-min headway from current hour
  const now = new Date();
  const baseHour = now.getHours();
  const baseMin = now.getMinutes();
  const rows: { h: number; m: number }[] = [];
  for (let i = -1; i < 9; i++) {
    let m = baseMin + i * 7;
    let h = baseHour;
    while (m >= 60) { h++; m -= 60; }
    while (m < 0) { h--; m += 60; }
    rows.push({ h, m });
  }

  const fmt = (h: number, m: number) =>
    `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')}`;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#FAF8F3',
      fontFamily: 'Space Grotesk, sans-serif',
      color: '#161512',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ background: line.color, color: '#fff', paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ height: 44, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 15, fontWeight: 600 }}>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['red', 'green', 'purple'] as BaseLineName[]).map((k) => (
              <button
                key={k}
                onClick={() => onLineChange(k)}
                style={{
                  width: 20, height: 20, borderRadius: 999,
                  background: k === selectedLine ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {k === selectedLine && (
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: line.color }}/>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', opacity: 0.85 }}>
            {line.short} LINE · SCHEDULE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, lineHeight: 1.1, letterSpacing: '-0.4px' }}>
            {stationName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px 0', overflowX: 'auto' }}>
          {days.map((d, i) => (
            <div
              key={d}
              style={{
                padding: '7px 13px', borderRadius: 999, whiteSpace: 'nowrap',
                background: i === 0 ? '#fff' : 'rgba(255,255,255,0.14)',
                color: i === 0 ? line.color : '#fff',
                fontSize: 12.5, fontWeight: 700, letterSpacing: '0.2px',
              }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'flex', padding: '12px 20px 6px',
        fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'rgba(0,0,0,0.45)',
        flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>{line.direction1.toUpperCase()}</div>
        <div style={{ width: 90, textAlign: 'center' }}>TIME</div>
        <div style={{ flex: 1, textAlign: 'right' }}>{line.direction2.toUpperCase()}</div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
        {rows.map((r, i) => {
          const isNow = i === 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 8px',
                borderBottom: '1px dashed rgba(0,0,0,0.07)',
                background: isNow ? `${line.color}10` : 'transparent',
                borderRadius: isNow ? 10 : 0,
              }}
            >
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, paddingRight: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, color: '#161512' }}>
                  {fmt(r.h, (r.m + 2) % 60)}
                </span>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: line.color, opacity: 0.65 }}/>
              </div>
              <div style={{ width: 90, textAlign: 'center', position: 'relative' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: isNow ? 17 : 14,
                  fontWeight: isNow ? 700 : 500,
                  color: isNow ? line.color : '#161512',
                  letterSpacing: '-0.3px',
                }}>
                  {fmt(r.h, r.m)}
                </span>
                {isNow && (
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: -3, height: 2, background: line.color, borderRadius: 2 }}/>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: line.color, opacity: 0.65 }}/>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, color: '#161512' }}>
                  {fmt(r.h, (r.m + 3) % 60)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
