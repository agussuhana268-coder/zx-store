/**
 * PlatformIcon Component
 * Renders the official brand icon for Android (Robot head) and Apple iOS (bitten Apple logo).
 * Avoids generic smartphone icons and bulky external dependencies.
 */

export function AndroidIcon({ size = 12, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.997-3.459a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5802 8.411 13.842 8.1 12 8.1s-3.5802.311-5.1325.8499L4.8452 5.4469a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.997 3.459C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  );
}

export function AppleIcon({ size = 12, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.75c.67-.82 1.13-1.96.99-3.12-1 .04-2.16.68-2.84 1.48-.6.7-1.14 1.84-.99 3.08 1.05-.04 2.18-.72 2.84-1.44z" />
    </svg>
  );
}

export default function PlatformIcon({ platform, size = 12, className = '' }) {
  const isIos = String(platform || '').toLowerCase().includes('ios');
  if (isIos) {
    return <AppleIcon size={size} className={className} />;
  }
  return <AndroidIcon size={size} className={className} />;
}
