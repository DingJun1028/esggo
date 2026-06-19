import * as React from 'react';
// Actually I don't recall seeing utils.ts for cn. I'll use a simple implementation or check.
// Checking previous edits, Button.tsx didn't use cn.
// I will implement a simple Switch without 'cn' dependency if not sure, or verify utils.
// Let's safe bet: standard React implementation with template literals.

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, defaultChecked = false, onCheckedChange, ...props }, ref) => {
    const [checked, setChecked] = React.useState(defaultChecked);

    const toggle = () => {
      const newState = !checked;
      setChecked(newState);
      onCheckedChange?.(newState);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        ref={ref}
        onClick={toggle}
        className={`
          peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? 'bg-emerald-500' : 'bg-gray-700'}
          ${className || ''}
        `}
        {...props}
      >
        <span
          className={`
            pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
export default Switch;
