import { useEffect, useRef } from 'react';

export default function KaraokeLine({ text, isActive, isPast }) {
  const ref = useRef(null);
  
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  return (
    <p 
      ref={ref} 
      className={`text-2xl md:text-4xl font-extrabold my-6 w-full break-words transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'text-spotibaiii scale-[1.02] opacity-100 origin-left drop-shadow-[0_0_10px_rgba(29,185,84,0.3)]' 
          : isPast 
            ? 'text-gray-500 opacity-40 hover:text-white hover:opacity-100' 
            : 'text-gray-400 opacity-60 hover:text-white hover:opacity-100'
        }`}
    >
      {text}
    </p>
  );
}