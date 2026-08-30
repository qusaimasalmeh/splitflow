import { useApp } from '../../context/AppContext';
import React, { useMemo } from 'react';
import { Settlement, User, PaymentConstraint } from '../../types';

interface GraphVisualizerProps {
  users: User[];
  settlements: Settlement[];
  constraints: PaymentConstraint[];
  currency: string;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  users,
  settlements,
  constraints,
  currency,
}) => {
  const { t } = useApp();
  // Compute circular layout for nodes
  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const count = users.length;
    if (count === 0) return map;

    const centerX = 150;
    const centerY = 130;
    const radius = Math.min(100, 35 + count * 14);

    users.forEach((u, idx) => {
      const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
      map.set(u.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });

    return map;
  }, [users]);

  return (
    <div className="w-full p-4 rounded-3xl bg-white border border-slate-200  overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-900 tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t('socialDebtGraph')}</span>
        </h4>
        <span className="text-[10px] text-slate-500">
          {settlements.length} active flow(s)
        </span>
      </div>

      <div className="relative w-full aspect-[300/260] max-h-64 flex items-center justify-center">
        <svg
          viewBox="0 0 300 260"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#14b8a6" />
            </marker>

            {/* Blacklist Barrier Marker */}
            <marker
              id="barrier"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#f43f5e" strokeWidth="2" />
            </marker>
          </defs>

          {/* 1. Blacklist Constraints (Dashed Red Lines) */}
          {constraints.map((c) => {
            const p1 = nodePositions.get(c.fromUserId);
            const p2 = nodePositions.get(c.toUserId);
            if (!p1 || !p2) return null;

            return (
              <g key={c.id}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* 2. Settlement Debt Arrows */}
          {settlements.map((s) => {
            const p1 = nodePositions.get(s.from);
            const p2 = nodePositions.get(s.to);
            if (!p1 || !p2) return null;

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={s.id}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                  strokeOpacity="0.85"
                />
                {/* Amount Badge in Center of Edge */}
                <rect
                  x={midX - 18}
                  y={midY - 9}
                  width="36"
                  height="18"
                  rx="6"
                  fill="#ffffff"
                  stroke="#14b8a6"
                  strokeWidth="1"
                  opacity="1"
                />
                <text
                  x={midX}
                  y={midY + 3.5}
                  textAnchor="middle"
                  fill="#0f766e"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {currency}
                  {Math.round(s.amount)}
                </text>
              </g>
            );
          })}

          {/* 3. User Nodes */}
          {users.map((u) => {
            const pos = nodePositions.get(u.id);
            if (!pos) return null;

            return (
              <g key={u.id} className="cursor-pointer">
                {/* Node Outer Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="16"
                  fill="#ffffff"
                  stroke={u.color || '#14b8a6'}
                  strokeWidth="2.5"
                />
                {/* Initial */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={u.color || '#14b8a6'}
                  fontSize="11"
                  fontWeight="900"
                >
                  {u.name.charAt(0)}
                </text>
                {/* Name Label */}
                <text
                  x={pos.x}
                  y={pos.y + 25}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {u.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
