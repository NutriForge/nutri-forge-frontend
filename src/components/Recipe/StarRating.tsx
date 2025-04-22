export default function StarRating({ rating }){
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className="size-4"
        viewBox="0 0 24 24"
        fill={i <= rating ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499c.27-.813 1.44-.813 1.71 0l1.518 4.568a1 1 0 00.95.69h4.764c.86 0 1.22 1.1.52 1.637l-3.857 2.804a1 1 0 00-.364 1.118l1.518 4.568c.27.813-.676 1.487-1.383 1.03l-3.857-2.804a1 1 0 00-1.176 0l-3.857 2.804c-.707.457-1.653-.217-1.383-1.03l1.518-4.568a1 1 0 00-.364-1.118L2.77 10.394c-.7-.538-.34-1.637.52-1.637h4.764a1 1 0 00.95-.69l1.518-4.568z"
        />
      </svg>
    );
  }

  return <div className="flex gap-1">{stars}</div>;
};