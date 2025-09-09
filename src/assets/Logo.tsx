
type Props = {
  size?: number; // px
  className?: string;
  title?: string; // accessible label
};

// IrisLogo - a compact SVG logo with a cyan → transparent radial gradient and the word "Iris" centered.
// Uses Tailwind-friendly className prop for easy placement.

const IrisLogo = () => {
  return (
    <div className="h-11 shrink-0 w-11! flex border-cyan-800 border justify-center items-center rounded-full bg-gradient-to-tr from-cyan-900 to-transparent">
      <p className="font-semibold text-sm">IRIS</p>
    </div>
  )
}

export default IrisLogo

// export default function IrisLogo({ size = 55, className = "", title = "Iris logo" }: Props) {
//   const px = Math.max(24, size);

//   return (
//     <div
//       role="img"
//       aria-label={title}
//       style={{ width: px, height: px }}
//       className={`inline-block ${className}`.trim()}
//     >
//       <svg
//         width={px}
//         height={px}
//         viewBox="0 0 100 100"
//         xmlns="http://www.w3.org/2000/svg"
//         preserveAspectRatio="xMidYMid meet"
//         aria-hidden="false"
//         focusable="false"
//       >
//         <defs>
//           <radialGradient id="cyanGrad" cx="35%" cy="35%" r="65%">
//             <stop offset="0%" stopColor="#00f5ff" stopOpacity="1" />
//             <stop offset="60%" stopColor="#00f5ff" stopOpacity="0.6" />
//             <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
//           </radialGradient>

//           <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.75" />
//             <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
//           </linearGradient>

//           <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
//             <feGaussianBlur stdDeviation="2" result="b" />
//             <feOffset dx="0" dy="1" result="o" />
//             <feMerge>
//               <feMergeNode in="o" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         {/* Base circle with soft cyan radial gradient */}
//         <g filter="url(#soft-shadow)">
//           <circle cx="50" cy="50" r="38" fill="url(#cyanGrad)" />
//           {/* Subtle ring for definition */}
//           <circle cx="50" cy="50" r="38" fill="none" stroke="url(#edgeGlow)" strokeWidth="1.6" />
//         </g>

//         {/* Decorative arcs to add iris-like shape */}
//         <g transform="translate(50,50)">
//           <path d="M -28 0 A 28 28 0 0 1 28 0" fill="none" stroke="#00a9d6" strokeOpacity="0.18" strokeWidth="2" />
//           <path d="M -20 -12 A 22 22 0 0 0 20 12" fill="none" stroke="#0096c9" strokeOpacity="0.12" strokeWidth="1.6" />
//         </g>

//         {/* Center circle - a bit darker to anchor the text */}
//         <circle cx="50" cy="50" r="12" fill="#06414d" fillOpacity="0.16" />

//         {/* Text: "Iris" centered. Use a bold geometric font for clarity. */}
//         <text
//           x="50"
//           y="55"
//           textAnchor="middle"
//           fontWeight="700"
//           fontSize="20"
//           fill="##000000"
//           fillOpacity="0.98"
//           style={{ letterSpacing: 0.6 }}
//         >
//           IRIS
//         </text>
//       </svg>
//     </div>
//   );
// }
