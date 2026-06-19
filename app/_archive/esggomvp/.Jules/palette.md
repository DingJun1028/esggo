## 2024-05-24 - [Aria-live on Dynamic Indicators]
**Learning:** Using `aria-live="polite"` and `aria-atomic="true"` on dynamic indicator text blocks like pagination and scaling ensures screen reader users are notified when internal values update, without needing a full element refocus. Also, separating contextual labels like "of unknown" using invisible or explicit span labels improves the readout for complex structures like `[current] / [total]`.
**Action:** Always consider `aria-live` for numerical changes (zoom/page) combined with specific `aria-label`s on their parent wrapper.
