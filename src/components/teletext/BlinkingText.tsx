import { useState, useEffect } from 'react';

interface BlinkingTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function BlinkingText({ children, className = '' }: BlinkingTextProps) {
  const [shouldBlink, setShouldBlink] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldBlink(!mq.matches);

    const handler = (e: MediaQueryListEvent) => setShouldBlink(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <span className={`${shouldBlink ? 'animate-blink' : ''} ${className}`}>
      {children}
      {!shouldBlink && <span className="sr-only"> (flashing indicator)</span>}
    </span>
  );
}
