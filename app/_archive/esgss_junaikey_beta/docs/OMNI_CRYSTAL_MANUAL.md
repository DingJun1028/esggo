# Omni Crystal (??謕?系統?) - 實作?謕?版本(Omni Manual)

> **[Metadata]**
>
> - **UUID**: `omni-crystal-2026-01-14-001`
> - **Version**: `1.0.0`
> - **Type**: `UI + Service`
> - **Author**: `System`
> - **Last Updated**: `2026-01-14T13:07:00+08:00`

## 1. ??謕???系統? (Requirements & Purpose)

### 系統?系統?

??HUD 系統?實作?謕???頦???謕雓???????????踐?系統?實作?馳?核心?謕?實作?謕?功能獢???減??????????謕?系統?實作?

### ?系統系統?

- **??????謕??*: ?賹??功能系統系統?系統?實作頛舀??實作蝘????????實作?謕鞎??撖???
- **?擗ㄜ??功能????**: 實作豯殉?鞊實作???系統?系統?實作頛舀??實作?
- \*_????謕鞎??????_: 功能????實作?????謕???謕?實作謅?ㄝ??豰???系統?
- **?蝘???謕雓?豰???**: ?擗ㄜ???豰刈系統荒筐????謕???頦???謕韏舀???暻鄞????蟡?????

### 系統?系統?

- ??系統?核心恃?擗???????謕?核心?
- ??系統?謇航扈?軋?實作謅?I ??謕?系統?
- ???豰刈??謕鞎????系統?實作畾???謕??
- ???蝘?系統蹇????系統?實作謕?鞊莎???暻鄞頩????ㄛ?頩????謕??頩??????

## 2. 功能?謕鞊梯???(Functionality & Architecture)

### 2.1 系統?功能

1. **?豲?????????穿???**
   - **??????謕鞊?* (系統?): ??謕?銵???蛔? 6 核心?謕???
   - **AI ?蹎???* (系統?): 系統?謇航扈?軋?實作謅?ㄞ雓系統?實作?
   - \*_?撖??鞈對?????_ (系統?): ?頛??功能系統? 5 實作?

2. \*_?蝘???系統蹇??_
   - 系統? ?蝞??實作謅?????功能??啣?
   - 功能皜?: ?撖??鞈對?????察?????謕?系統?
   - 實作? 系統?實作?察????蝘遛??????系統?
   - 功能 ?豲??實作謅???實作?
   - ?????: ?蝘遛???謕頩???擗??????系統?

3. **????系統?**
   - ?? ?謜??系統? (`s_deep_search`)
   - ?? 系統?系統? (`s_data_analysis`)
   - 系統?實作??剜??(`s_goal_tracking`)
   - 系統?功能???? (`s_seraphim_advisor`)
   - ?? ?撖??鞈對?????(`s_quick_note`)
   - 系統? ?賹??荒筐謘??魂?

4. **AI ?蹎??制????蛔?**
   - 系統?謇航扈?軋?功能
   - 實作?豢?系統?實作?
   - ?豲???實作?
   - ?蹎??制????制??畾???

### 2.2 ?豯殉?鞊堆??嗉??? (Interfaces)

```typescript
// 實作???
export enum CrystalState {
  IDLE = 'idle',
  THINKING = 'thinking',
  EXECUTING = 'executing',
  ERROR = 'error',
  COMPLETE = 'complete',
}

// ???????穿???
export enum InteractionMode {
  TOOL_MENU = 'tool_menu',
  AI_CHAT = 'ai_chat',
  QUICK_SKILLS = 'quick_skills',
}

// ????蹓澗雓?
export interface OmniTool {
  id: string;
  name: string;
  icon: string;
  skillId: string;
  description: string;
}

// 實作??憸?Props
export interface OmniCrystalProps {
  onToolSelect: (toolId: string) => void;
  onQuestionSubmit: (question: string) => void;
  initialState?: CrystalState;
}

// ?蹎??制?謘?蹐?
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  skillExecuted?: string;
}

// AI 系統?
export interface AIResponse {
  message: string;
  intent?: string;
  skillToExecute?: string;
  confidence: number;
}
```

### 2.3 功能?(Technology Stack)

- **Language**: TypeScript 5.x
- **Framework**: React 18+
- **Animation**: Framer Motion 10+
- **Icons**: Lucide React
- **AI Integration**: SkillExecutionEngine
- **State Management**: Zustand (useOmniResonance)

## 3. 100% 系統系統? (Reproduction Guide)

> **?? AI Instruction**: To reproduce this module, follow these steps exactly.

### Step 1: Create Core Component

Create `src/components/OmniCrystal/OmniCrystalCore.tsx`:

```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CrystalState, InteractionMode } from './types';
import { ToolMenu } from './ToolMenu';
import { CrystalChat } from './CrystalChat';
import { QuickSkills } from './QuickSkills';

export const OmniCrystalCore: React.FC<OmniCrystalProps> = ({
    onToolSelect,
    onQuestionSubmit,
    initialState = CrystalState.IDLE,
}) => {
    const [state, setState] = useState<CrystalState>(initialState);
    const [mode, setMode] = useState<InteractionMode | null>(null);

    const handleClick = () => setMode(InteractionMode.TOOL_MENU);
    const handleDoubleClick = () => setMode(InteractionMode.AI_CHAT);
    const handleLongPress = () => setMode(InteractionMode.QUICK_SKILLS);

    return (
        <motion.div className="omni-crystal-container">
            {/* Crystal Orb */}
            <motion.div
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                className={`crystal-orb state-${state}`}
            />

            {/* Interaction Panels */}
            {mode === InteractionMode.TOOL_MENU && <ToolMenu onSelect={onToolSelect} />}
            {mode === InteractionMode.AI_CHAT && <CrystalChat onSubmit={onQuestionSubmit} />}
            {mode === InteractionMode.QUICK_SKILLS && <QuickSkills />}
        </motion.div>
    );
};
```

### Step 2: Create Tool Menu

Create `src/components/OmniCrystal/ToolMenu.tsx`:

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart, Target, Lightbulb, FileText, Settings } from 'lucide-react';

const tools: OmniTool[] = [
    { id: 'search', name: '?謜??系統?', icon: Search, skillId: 's_deep_search' },
    { id: 'analysis', name: '系統?系統?', icon: BarChart, skillId: 's_data_analysis' },
    { id: 'tracking', name: '實作??剜??, icon: Target, skillId: 's_goal_tracking' },
    { id: 'advisor', name: '功能????', icon: Lightbulb, skillId: 's_seraphim_advisor' },
    { id: 'note', name: '?撖??鞈對?????, icon: FileText, skillId: 's_quick_note' },
    { id: 'settings', name: '?賹??荒筐謘??魂?', icon: Settings, skillId: 'settings' },
];

export const ToolMenu: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
    return (
        <motion.div className="tool-menu-container">
            {tools.map((tool, index) => (
                <motion.button
                    key={tool.id}
                    onClick={() => onSelect(tool.skillId)}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                        scale: 1,
                        rotate: (360 / tools.length) * index
                    }}
                    className="tool-button"
                >
                    <tool.icon size={20} />
                    <span>{tool.name}</span>
                </motion.button>
            ))}
        </motion.div>
    );
};
```

### Step 3: Create AI Chat Interface

Create `src/components/OmniCrystal/CrystalChat.tsx`:

```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export const CrystalChat: React.FC<{ onSubmit: (q: string) => void }> = ({ onSubmit }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const handleSubmit = () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        onSubmit(input);
        setInput('');
    };

    return (
        <motion.div className="crystal-chat-container">
            <div className="messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="實作豯券??系統?..."
                />
                <button onClick={handleSubmit}>
                    <Send size={16} />
                </button>
            </div>
        </motion.div>
    );
};
```

### Step 4: Integration with OmniResonanceHUD

Modify `src/3-interface/OmniResonanceHUD.tsx`:

```typescript
import { OmniCrystalCore } from '@/components/OmniCrystal/OmniCrystalCore';

// In orb mode, replace with OmniCrystalCore
if (viewMode === 'orb') {
    return (
        <OmniCrystalCore
            onToolSelect={(skillId) => {
                // Execute skill via SkillExecutionEngine
                console.log('Executing skill:', skillId);
            }}
            onQuestionSubmit={(question) => {
                // Process question via AI
                console.log('User question:', question);
            }}
        />
    );
}
```

### Step 5: Styling

Create `src/components/OmniCrystal/styles.css`:

```css
.crystal-orb {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  cursor: pointer;
}

.crystal-orb.state-idle {
  background: radial-gradient(circle, gold, rgba(0, 0, 0, 0.95));
  animation: pulse 2s infinite;
}

.crystal-orb.state-thinking {
  background: radial-gradient(circle, cyan, rgba(0, 0, 0, 0.95));
  animation: spin 1s linear infinite;
}

.crystal-orb.state-executing {
  background: radial-gradient(circle, lime, rgba(0, 0, 0, 0.95));
  animation: spin 1.5s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

## 4. ?頦?????謕?摮??(Verification & Disclosure)

### 4.1 實作頦??? (Unit Verification)

- [ ] **Test Case 1**: 系統?實作?賃?????????謕雓?
  - Action: Click crystal orb
  - Expected: Tool menu appears with 6 tools in circular layout

- [ ] **Test Case 2**: 系統?系統?系統? AI ?蹎???
  - Action: Double-click crystal orb
  - Expected: Chat interface appears with input field

- [ ] **Test Case 3**: ??????謕雓實作???
  - Action: Click "?謜??系統?" in tool menu
  - Expected: `s_deep_search` skill is triggered

- [ ] **Test Case 4**: AI ?蹎??實作?豢??
  - Input: "?賹???系統?功能??????功能?
  - Expected: Intent = `s_data_analysis`, skill executed

- [ ] **Test Case 5**: ??實作蟡ㄜ??
  - Action: Trigger skill execution
  - Expected: Crystal state changes: idle ??thinking ??executing ??complete

### 4.2 4T ??察???????? (3+1 Protocol)

- **Traceable**: `source_origin` = `OmniCrystalCore` (Yes)
- **Trackable**: Each interaction generates `trace_id` via SkillExecutionEngine (Pending)
- **Calculable**: AI confidence score tracked (Pending)
- **Immutable**: Chat history stored with timestamps (Pending)

## 5. ??ㄞ?獢?系統系統?(Source Reference)

- [OmniCrystalCore.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/components/OmniCrystal/OmniCrystalCore.tsx) (Pending)
- [ToolMenu.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/components/OmniCrystal/ToolMenu.tsx) (Pending)
- [CrystalChat.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/components/OmniCrystal/CrystalChat.tsx) (Pending)
- [OmniResonanceHUD.tsx](file:///c:/Project/ESGss%20JunAiKey%20Beta/src/3-interface/OmniResonanceHUD.tsx)

## 6. ?頛舀???船??謚叟? (Usage Examples)

### ????? 1: ??謕雓系統?

```typescript
import { OmniCrystalCore } from '@/components/OmniCrystal/OmniCrystalCore';

function MyDashboard() {
    return (
        <OmniCrystalCore
            onToolSelect={(skillId) => {
                executeSkill(skillId);
            }}
            onQuestionSubmit={(question) => {
                processAIQuery(question);
            }}
        />
    );
}
```

### ????? 2: ?蹎??制??頩??

```
?頛舀???? "?賹???系統?功能??????功能?

系統?實作謍???:
1. ???? idle ??thinking
2. AI ???系統?: s_data_analysis
3. ???? thinking ??executing
4. 實作??? 系統?系統?
5. 系統?系統?: "系統?系統?30 ?????實作謅?ㄞ頩??Scope 1 ??謕?謜???荒???12%..."
6. ???? executing ??complete
7. ?頛??實作?軋??系統?
8. ???? complete ??idle (2?謢???)
```

## 7. ??????謕?皜??(Maintenance & Extension)

### 實作????

??`ToolMenu.tsx` ??`tools` ????豲??系統?

```typescript
{
    id: 'my_tool',
    name: '實作????,
    icon: MyIcon,
    skillId: 's_my_skill',
    description: '????功能
}
```

### 實作嚗賂???實作?

?鞈?僱??`styles.css` ?豲?? `@keyframes`:

```css
.crystal-orb.state-custom {
  background: radial-gradient(circle, purple, black);
  animation: custom-animation 1s ease-in-out;
}
```

### AI 系統?系統?

??AI 系統?功能??謚怎???謕雓系統?實作蹎???

```typescript
const intentMap = {
  '系統?': 's_data_analysis',
  '系統?': 's_deep_search',
  ?璇??? 's_seraphim_advisor',
  // 系統?系統?
  '??謕??: 's_prediction',
};
```

---

**??謕雓????制?**:

- `1.0.0` (2026-01-14): 實作獢???實作謅????謘???
