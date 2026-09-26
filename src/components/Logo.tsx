type Props = { size?: number };

/** Логотип: сетка 3×3 из квадратиков, правый верхний — акцентный. */
export default function Logo({ size = 28 }: Props) {
  const cells = [2, 12, 22];
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      {cells.map((y) =>
        cells.map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="4"
            height="4"
            fill={x === 22 && y === 2 ? 'var(--accent)' : '#FFFFFF'}
          />
        )),
      )}
    </svg>
  );
}
