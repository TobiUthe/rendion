interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" className="flex border-b border-sand-200 overflow-x-auto no-scrollbar chart-tabs-scroll">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`group relative min-w-[80px] flex-shrink-0 whitespace-nowrap px-3 pb-2.5 pt-1 text-sm sm:text-sm-plus font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${
              isSelected
                ? "text-primary-700"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {opt.label}
            <span className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-200 ${
              isSelected
                ? "bg-primary-600 scale-x-100"
                : "bg-neutral-300 scale-x-0 group-hover:scale-x-100"
            }`} />
          </button>
        );
      })}
    </div>
  );
}
