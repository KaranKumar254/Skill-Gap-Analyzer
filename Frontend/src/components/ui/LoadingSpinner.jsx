/**
 * Inline loading spinner
 * Usage: <LoadingSpinner /> or <LoadingSpinner size={24} color="#000" />
 */
export default function LoadingSpinner({ size = 16, color = "#000" }) {
  return (
    <span
      className="spin"
      style={{ width: size, height: size, borderTopColor: color }}
      aria-label="Loading..."
    />
  );
}