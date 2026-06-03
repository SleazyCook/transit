import type { Station } from '../types';

type Props = {
  stations: Station[];
  currentIdx: number;
  lineColor: string;
  variant?: 'dark' | 'light';
  width?: number;
};

export default function HSchematic({
  stations,
  currentIdx,
  lineColor,
  variant = 'dark',
  width = 340,
}: Props) {
  const range = 3;
  const start = Math.max(0, Math.min(stations.length - 7, currentIdx - range));
  const visible = stations.slice(start, start + 7);
  const height = 72;
  const stepX = visible.length > 1 ? width / (visible.length - 1) : width / 2;
  const y = height / 2;

  const isLight = variant === 'light';
  const trackBase = isLight ? `${lineColor}25` : 'rgba(255,255,255,0.2)';
  const trackDash = isLight ? `${lineColor}55` : 'rgba(255,255,255,0.5)';
  const dotFill = isLight ? `${lineColor}45` : 'rgba(255,255,255,0.45)';
  const dotStroke = isLight ? lineColor : 'rgba(255,255,255,0.85)';
  const textFill = isLight ? 'rgba(22,21,18,0.45)' : 'rgba(255,255,255,0.6)';
  const currentTextFill = isLight ? '#161512' : '#fff';
  const currentDotFill = '#fff';
  const currentDotStroke = isLight ? lineColor : 'rgba(255,255,255,0.85)';

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <line x1="0" y1={y} x2={width} y2={y} stroke={trackBase} strokeWidth="3" />
      <line x1="0" y1={y} x2={width} y2={y} stroke={trackDash} strokeWidth="2.5" strokeDasharray="6 6" />
      {visible.map((s, i) => {
        const x = i * stepX;
        const isCurrent = start + i === currentIdx;
        const shortLabel = s.name.split('/')[0].split(' ').slice(0, 2).join(' ');
        return (
          <g key={s.name + i}>
            <circle
              cx={x} cy={y}
              r={isCurrent ? 10 : 5}
              fill={isCurrent ? currentDotFill : dotFill}
              stroke={isCurrent ? currentDotStroke : dotStroke}
              strokeWidth={isCurrent ? 3 : 2}
            />
            {isCurrent && <circle cx={x} cy={y} r={4} fill={lineColor} />}
            <text
              x={x}
              y={isCurrent ? y - 17 : y + 21}
              textAnchor="middle"
              fontSize={isCurrent ? 11 : 9}
              fontWeight={isCurrent ? 700 : 500}
              fontFamily="Space Grotesk, sans-serif"
              fill={isCurrent ? currentTextFill : textFill}
            >
              {shortLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
