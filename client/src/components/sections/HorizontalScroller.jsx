export default function HorizontalScroller({ title, children }) {
  return (
    <div className="px-6 mb-10">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
        <span className="text-xs md:text-sm text-gray-400 font-semibold hover:underline cursor-pointer">Show all</span>
      </div>
      {/* Added items-stretch to make cards same height */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 items-stretch">
        {children}
      </div>
    </div>
  );
}