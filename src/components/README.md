# ESGGO OmniComponent Library v1.1.0

## "ESGGO Classic 善向永續 經典版"

### Installation

```tsx
import {
  OmniThemeProvider,
  OmniButton,
  OmniInput,
  OmniCard,
  OmniKPICard,
  OmniTable,
  OmniAssistant,
  ThemeRoom,
} from '@/components';
```

### Usage

```tsx
// Theme Provider (wrap your app)
<OmniThemeProvider>
  <ThemeRoom variant="compact" showLabels={true} />
  <OmniButton variant="primary">Submit</OmniButton>
  <OmniKPICard
    title="Carbon Emissions"
    value={8246.5}
    unit="t CO2e"
    trend="up"
    change={12.5}
    griRef="GRI 305-1"
    source="ERP System"
  />
</OmniThemeProvider>
```

### Database Connection (Omnidb)

```tsx
import { Omnidb } from '@/lib/omnidb';

// Fetch all data
const data = await Omnidb.fetchAll();

// Or fetch specific tables
const reports = await Omnidb.listReports();
const tasks = await Omnidb.listTasks();
const audits = await Omnidb.listAudits();
```

### Component Categories

| Category  | Components                                                                                                                                             | Count   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Atoms     | Button, Input, Select, Checkbox, Radio, Toggle, Badge, Icon, Divider, Card, Tooltip, Toast, Link, Accordion, Tabs, Avatar, Progress, Skeleton, Spinner | 19      |
| Molecules | KPICard, FormField, SearchBar, Breadcrumb, FilterBar                                                                                                   | 5       |
| Organisms | Modal, Table, Sidebar, Header, CardGrid                                                                                                                | 5       |
| Mobile    | BottomNav, Drawer, MobileInput, MobileKPICard                                                                                                          | 4       |
| Templates | PageTemplate                                                                                                                                           | 1       |
| **Total** |                                                                                                                                                        | **40+** |

### Theme Support

- **Light**: Berkeley Blue (#003262) / California Gold (#FDB515)
- **Dark**: Gold (#FDB515) / Founders Rock (#3B7EA1)
- **System**: Follows OS preference

### 5T Protocol Integration

All components support Tangible, Traceable, Trackable, Transparent, Trustworthy dimensions.
