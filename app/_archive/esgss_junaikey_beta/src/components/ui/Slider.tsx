import React from 'react';

interface SliderProps {
  defaultValue?: number[];
  max?: number;
  step?: number;
  className?: string;
  onValueChange?: (value: number[]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  defaultValue = [0],
  max = 100,
  step = 1,
  className = '',
  onValueChange,
}) => {
  const [value, setValue] = React.useState(defaultValue[0]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <div className={`relative flex items-center w-full h-5 ${className}`}>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00FFFF] focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/50"
      />
    </div>
  );
};

export default Slider;

