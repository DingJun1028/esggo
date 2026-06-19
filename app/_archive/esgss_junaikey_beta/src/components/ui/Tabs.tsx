import * as React from 'react';

const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  // Note: Simple implementation, actual context switching logic is often handled by a parent Context or library like Radix
  // For this generic implementation, we assume basic styling.
  // In a real generic setup without Radix, we'd need a Context.
  // BUT the user code uses <Tabs defaultValue="..."> which suggests Radix.
  // Since I don't have Radix installed, I will make a simple Context version.
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setActiveTab(value)}
      data-state={activeTab === value ? 'active' : 'inactive'}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

// Context for rudimentary state management
const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (v: string) => void;
} | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within a Tabs provider');
  return context;
}

const TabsRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
  const [activeTab, setActiveTabState] = React.useState(defaultValue || '');

  const setActiveTab = (value: string) => {
    setActiveTabState(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = 'Tabs';

// Export as Tabs to match expected usage
export { TabsList, TabsTrigger, TabsContent };
export default TabsRoot;
