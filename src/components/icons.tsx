import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8.3a4 4 0 0 1-8 0" />
      <path d="M12 2v2" />
      <path d="m18.5 4.5-1.4 1.4" />
      <path d="m5.5 4.5 1.4 1.4" />
      <path d="M12 12v10" />
      <path d="M12 12H8" />
      <path d="M12 12h4" />
      <path d="M12 22h-4" />
      <path d="M12 22h4" />
      <path d="M4 12H2" />
      <path d="M22 12h-2" />
      <path d="M4 16H2" />
      <path d="M22 16h-2" />
      <path d="M4 20H2" />
      <path d="M22 20h-2" />
    </svg>
  ),
};
