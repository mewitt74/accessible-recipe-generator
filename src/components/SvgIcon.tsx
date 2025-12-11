/**
 * SVG Icon Component
 * Renders line-art cooking icons with accessibility support
 */

interface IconProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
  title?: string;
  color?: 'currentColor' | string;
}

const SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 40,
  large: 80,
};

export default function SvgIcon({
  name,
  size = 'medium',
  className = '',
  title,
  color = 'currentColor',
}: IconProps): JSX.Element {
  const sizeValue = typeof size === 'number' ? size : SIZE_MAP[size];

  // SVG icons mapping
  const icons: Record<string, string> = {
    // Cutting/Prep
    chop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v16M18 4v16M2 7h20M2 17h20"/>
      <circle cx="6" cy="12" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="18" cy="12" r="1"/>
    </svg>`,

    cut: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6l8 8m0 0l8 8M3 18l8-8m0 0l8-8"/>
      <circle cx="5" cy="5" r="1"/>
      <circle cx="19" cy="19" r="1"/>
    </svg>`,

    slice: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
      <path d="M2 2v20h20V2H2z"/>
    </svg>`,

    // Heating
    boil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v10c0 2 2 4 6 4s6-2 6-4V4"/>
      <circle cx="12" cy="3" r="1"/>
      <path d="M10 20h4"/>
      <path d="M8 22h8"/>
      <path d="M9 8h.01M15 8h.01"/>
    </svg>`,

    fry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10c0-1 1-3 9-3s9 2 9 3v8c0 1-1 2-2 2H5c-1 0-2-1-2-2v-8z"/>
      <path d="M7 14l2 2M14 14l2 2"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
    </svg>`,

    bake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4v12c0 2 2 4 8 4s8-2 8-4V4"/>
      <rect x="2" y="4" width="20" height="14" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>`,

    roast: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="13" rx="8" ry="10"/>
      <path d="M12 3v10"/>
      <path d="M6 10l-3-2M18 10l3-2"/>
      <path d="M8 17h8"/>
    </svg>`,

    // Mixing
    mix: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v12c0 2 2 4 6 4s6-2 6-4V4"/>
      <path d="M8 8c2 1 4 1 6 0M8 12c2 1 4 1 6 0"/>
      <line x1="12" y1="2" x2="12" y2="1"/>
    </svg>`,

    whisk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4c0 2 2 3 6 3s6-1 6-3"/>
      <path d="M6 5l-2 10c0 1 1 2 2 2h12c1 0 2-1 2-2l-2-10"/>
      <line x1="12" y1="2" x2="12" y2="1"/>
    </svg>`,

    stir: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v16c0 2 1 3 2 3h1c1 0 2-1 2-3V2"/>
      <path d="M8 8c2 1 4 1 6 0M8 12c2 1 4 1 6 0"/>
    </svg>`,

    // Seasoning
    season: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v4c0 2-1 3-2 3h-4c-1 0-2-1-2-3V4z"/>
      <path d="M7 9h10"/>
      <circle cx="6" cy="15" r="2"/>
      <circle cx="12" cy="15" r="2"/>
      <circle cx="18" cy="15" r="2"/>
    </svg>`,

    salt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v4c0 2-1 3-2 3h-4c-1 0-2-1-2-3V4z"/>
      <path d="M7 9h10M8 15l2-3m2 3l2-3m2 3l2-3"/>
    </svg>`,

    // Draining
    drain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h12v8c0 2-1 3-2 3H8c-1 0-2-1-2-3V4z"/>
      <path d="M10 15l-2 4h8l-2-4"/>
      <line x1="12" y1="15" x2="12" y2="20"/>
    </svg>`,

    // Serving
    serve: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3h8c1 0 2 1 2 2v8c0 1-1 2-2 2H8c-1 0-2-1-2-2V5c0-1 1-2 2-2z"/>
      <path d="M6 13h12v3c0 1-1 2-2 2H8c-1 0-2-1-2-2v-3z"/>
    </svg>`,

    plate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="6"/>
    </svg>`,

    // Cooling
    cool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 0-2 1-2 2v6c0 1 1 2 2 2s2-1 2-2V4c0-1-1-2-2-2z"/>
      <path d="M8 10l-2-2M16 10l2-2"/>
      <circle cx="12" cy="18" r="3"/>
    </svg>`,

    rest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <line x1="12" y1="6" x2="12" y2="12"/>
      <line x1="12" y1="12" x2="15" y2="15"/>
    </svg>`,

    // Time
    timer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="7"/>
      <path d="M12 9v4l3 2"/>
      <path d="M9 2h6"/>
    </svg>`,

    clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>`,

    // Equipment
    knife: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2l7 7-12 12H2V14z"/>
      <path d="M2 14l7 7"/>
    </svg>`,

    pan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10c0-1 1-3 9-3s9 2 9 3v8c0 1-1 2-2 2H5c-1 0-2-1-2-2v-8z"/>
      <line x1="12" y1="3" x2="12" y2="1"/>
    </svg>`,

    pot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v10c0 2 2 4 6 4s6-2 6-4V4"/>
      <line x1="10" y1="20" x2="14" y2="20"/>
      <line x1="9" y1="22" x2="15" y2="22"/>
    </svg>`,

    bowl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 8c0-1 1-2 2-2h14c1 0 2 1 2 2v2c0 3-2 6-4 8-2 2-4 4-6 4s-4-2-6-4c-2-2-4-5-4-8V8z"/>
    </svg>`,

    spoon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c0-1 2-2 4-2s4 1 4 2v4c0 2-1 3-2 3H6c-1 0-2-1-2-3V6z"/>
      <line x1="8" y1="9" x2="8" y2="20"/>
    </svg>`,

    // Warning
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2l9.5 16H2.5L12 2z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,

    hot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2c-1 1-2 3-2 5 0 3 2 5 2 5s2-2 2-5c0-2-1-4-2-5z"/>
      <path d="M12 10c0 2 1 4 1 6 0 2-1 3-1 3s-1-1-1-3c0-2 1-4 1-6z"/>
    </svg>`,
  };

  const svgContent = icons[name.toLowerCase()] || icons.warning;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={sizeValue}
      height={sizeValue}
      className={`svg-icon ${className}`}
      style={{
        color,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      role="img"
      aria-label={title || name}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
