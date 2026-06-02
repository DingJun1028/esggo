# ADR-003: Implementing OmniAgent Pulse Draggable, Resizable, and Minimized States

## Status:
Accepted

## Context:
The OmniAgent Pulse, a critical real-time status indicator, needs to be more flexible and less intrusive for the user. Users require the ability to reposition, resize, and temporarily minimize the pulse to optimize their workspace and focus, while retaining quick access to its status.

## Decision:
The OmniAgent Pulse component will be enhanced with the following functionalities:
*   **Draggable:** Users can drag and drop the component to any position on the screen, persisting its last known position.
*   **Resizable:** The component will support multiple predefined sizes (small, medium, large) to adjust its visual prominence.
*   **Minimizable/Closable with Animation:** The component can be minimized to the BrandLogo's location in the sidebar with a smooth "fly-to" animation. It can be restored by interacting with the minimized icon. The visibility and state will persist across sessions.

## Consequences:
*   **Positive:**
    *   Improved user experience by allowing personalization of the workspace.
    *   Reduced visual clutter by enabling minimization.
    *   Enhanced interactivity and perceived responsiveness of the OmniAgent.
*   **Negative:**
    *   Increased complexity in component state management (position, size, minimized state).
    *   Requires integration with `framer-motion` and browser `localStorage`.
    *   Ensuring accurate logo position tracking introduces dependency between `AppShellV2` and `OmniAgentPulseFloating`.
*   **Neutral:**
    *   Requires careful design of UI controls for resize and minimize actions.

## Options Considered:
*   **Static position only:** Rejected due to user feedback and the need for a less intrusive experience.
*   **Full arbitrary resizing:** Rejected due to increased complexity and potential for UI breakage; predefined sizes offer better control and consistency.
*   **No animation for minimization:** Rejected as smooth transitions enhance user experience and perception of system responsiveness.

## Compliance:
*   **Beauty (Tangible):** Enhances the visual appeal and interactive fluidity of the UI.
*   **Transferful (Trackable):** State persistence ensures a consistent user experience across sessions.

## Notes:
The implementation utilizes `framer-motion` for animations and `localStorage` for state persistence. Future refinements may include dynamic logo position detection via React Context.
