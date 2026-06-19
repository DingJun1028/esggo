/**
 * 🎭 StreamParser: State machine for parsing fragmented LLM streams.
 * Separates <thought>, <skill_call>, and regular text.
 */
class StreamParser {
    constructor(onEvent) {
        this.onEvent = onEvent;
        this.buffer = "";
        this.currentTag = null;
    }

    push(chunk) {
        this.buffer += chunk;
        this.parse();
    }

    parse() {
        // Tag Detection Logic
        const tags = [
            { open: "<thought>", close: "</thought>", type: "thought" },
            { open: "<skill_call>", close: "</skill_call>", type: "skill_call" }
        ];

        let changed = true;
        while (changed) {
            changed = false;

            if (!this.currentTag) {
                // Look for opening tags
                let earliestOpen = -1;
                let detectedTag = null;

                for (const tag of tags) {
                    const idx = this.buffer.indexOf(tag.open);
                    if (idx !== -1 && (earliestOpen === -1 || idx < earliestOpen)) {
                        earliestOpen = idx;
                        detectedTag = tag;
                    }
                }

                if (detectedTag) {
                    // Send text before tag
                    if (earliestOpen > 0) {
                        this.onEvent({ type: 'text', content: this.buffer.substring(0, earliestOpen) });
                    }
                    this.currentTag = detectedTag;
                    this.buffer = this.buffer.substring(earliestOpen + detectedTag.open.length);
                    changed = true;
                } else {
                    // No open tags, send all but last few chars to handle partial tags
                    const safeLength = Math.max(0, this.buffer.length - 15);
                    if (safeLength > 0) {
                        this.onEvent({ type: 'text', content: this.buffer.substring(0, safeLength) });
                        this.buffer = this.buffer.substring(safeLength);
                    }
                }
            } else {
                // Look for closing tag
                const closeIdx = this.buffer.indexOf(this.currentTag.close);
                if (closeIdx !== -1) {
                    const content = this.buffer.substring(0, closeIdx);
                    this.onEvent({ type: this.currentTag.type, content });
                    this.buffer = this.buffer.substring(closeIdx + this.currentTag.close.length);
                    this.currentTag = null;
                    changed = true;
                }
            }
        }
    }

    flush() {
        if (this.buffer.length > 0) {
            this.onEvent({ type: this.currentTag ? this.currentTag.type : 'text', content: this.buffer });
            this.buffer = "";
        }
    }
}

module.exports = StreamParser;
