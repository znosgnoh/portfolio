export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--navy, #0a192f)',
      }}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
