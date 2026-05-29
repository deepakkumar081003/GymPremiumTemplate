import type { ReactNode } from "react";

type GymIconName =
  | "dumbbell"
  | "bolt"
  | "heart-pulse"
  | "leaf"
  | "target"
  | "users"
  | "chart"
  | "message"
  | "clipboard"
  | "refresh"
  | "apple"
  | "check-circle"
  | "bell"
  | "star"
  | "shield"
  | "phone"
  | "mail"
  | "map-pin"
  | "clock";

type GymIconProps = {
  name: GymIconName;
  className?: string;
};

const icons: Record<GymIconName, ReactNode> = {
  dumbbell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.5 10.5h11M4 12V9m16 3V9M7 12V9m10 3V9M9.5 7.5v9m5-9v9"
    />
  ),
  bolt: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L6 14h5l-1 7 7-11h-5l1-7z" />
  ),
  "heart-pulse": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20s-6.5-4.5-6.5-9a3.5 3.5 0 016.5-1.5A3.5 3.5 0 0118.5 11c0 4.5-6.5 9-6.5 9zM8 11h2l1 2 2-4 1 2h2"
    />
  ),
  leaf: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21c-4-3.5-6-7-6-11a6 6 0 0112 0c0 4-2 7.5-6 11zM12 10v11"
    />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </>
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 19v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M12 11a4 4 0 100-8 4 4 0 000 8zm8 8v-1a3 3 0 00-2-2.8M16 3.2a4 4 0 010 7.6"
    />
  ),
  chart: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M4 19h16M8 15v-4m4 4V9m4 6v-7" />
  ),
  message: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8M8 14h5M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h4a8 8 0 018 8z"
    />
  ),
  clipboard: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 0V4a1 1 0 011-1h4a1 1 0 011 1v1"
    />
  ),
  refresh: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12a8 8 0 0113.7-5.7M20 12a8 8 0 01-13.7 5.7M16 4h4V0M8 20H4v4"
    />
  ),
  apple: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20c-3 0-5-2.5-5-6 0-3 2-5.5 5-5.5s5 2.5 5 5.5c0 3.5-2 6-5 6zM12 8.5V4M9.5 4.5c1-1.5 2.5-2 4.5-2"
    />
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </>
  ),
  bell: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17H9m8-4a6 6 0 10-12 0v3l-1 2h14l-1-2v-3M10 20a2 2 0 004 0"
    />
  ),
  star: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l2.4 5.5L20 9.5l-4.5 3.8L16.8 19 12 16l-4.8 3 1.3-5.7L4 9.5l5.6-1L12 3z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l7 3v6c0 4.5-3.5 7.5-7 9-3.5-1.5-7-4.5-7-9V6l7-3z"
    />
  ),
  phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 4h2l1 3-2 1a11 11 0 005 5l1-2 3 1v2a2 2 0 01-2 2C9.7 16 8 14.3 8 12a8 8 0 018-8 2 2 0 012 2z"
    />
  ),
  mail: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7l8 5 8-5M4 7v10h16V7"
    />
  ),
  "map-pin": (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M12 8v4l3 2" />
    </>
  ),
};

export function GymIcon({ name, className = "h-6 w-6" }: GymIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      {icons[name]}
    </svg>
  );
}

export type { GymIconName };
