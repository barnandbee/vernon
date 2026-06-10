type VernonLogoProps = {
  size?: number;
  light?: boolean;
};

export default function VernonLogo({ size = 32, light = false }: VernonLogoProps) {
  const color = light ? '#ffffff' : 'var(--primary)';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill={light ? 'rgba(255,255,255,0.15)' : '#e8f4f8'} />
      <path d="M12 13 L20 27 L28 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="27" r="2.5" fill={color} />
    </svg>
  );
}
