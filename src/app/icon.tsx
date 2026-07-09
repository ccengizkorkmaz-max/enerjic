import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Dynamic logo favicon generation (matches Leaf logo style)
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ecfdf5', // bg-emerald-50
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          padding: '4px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#059669" // text-emerald-600
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.8a7 7 0 0 1-9 8.2Z" />
          <path d="M9 10a5 5 0 0 1 5-5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
