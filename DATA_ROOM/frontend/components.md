# Key Components

Library: `src/components/`

## 1. `SignalCard.tsx`
- **Role**: The primary unit of the UI. Displays a trading opportunity.
- **Features**:
  - **Embedded Chart**: Uses `lightweight-charts` to show candle history + entry/exit lines.
  - **Expandable Rationale**: Collapsible section for AI explanation.
  - **Actions**: "Discuss with Copilot" (opens modal with context).

## 2. `TacticalAnalysisDrawer.tsx`
- **Role**: Slide-over panel for deep dives.
- **Content**: Detailed metrics, larger chart, multiple timeframe analysis.

## 3. `CopilotModal.tsx` / `AdvisorChat.tsx`
- **Role**: The Conversational Interface.
- **Integration**: Floats globally (FAB) or opens relative to a Signal.
- **Context Awareness**: When opened via "Discuss", it pre-loads the signal parameters into the chat context.
