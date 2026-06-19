import * as React from 'react';
import { Circle } from 'lucide-react';

const RadioGroupContext = React.createContext<
  | {
    value?: string;
    onValueChange?: (value: string) => void;
  }
  | undefined
>(undefined);

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`grid gap-2 ${className}`} ref={ref} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context?.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      value={value}
      className={`
        aspect-square h-4 w-4 rounded-full border border-slate-200 border-slate-900 text-slate-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        flex items-center justify-center
        ${isChecked ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-400 bg-transparent'}
        ${className}
      `}
      onClick={() => context?.onValueChange?.(value)}
      ref={ref}
      {...props}
    >
      {isChecked && <Circle className="h-2.5 w-2.5 fill-current text-white" />}
    </button>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
export default RadioGroup;
