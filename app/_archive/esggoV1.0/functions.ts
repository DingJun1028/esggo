import { inngest } from "./lib/inngest/client";

// 此檔案為自動生成的預留佔位(Placeholder)，旨在解決 IDE 快取中的幽靈檔案錯誤。
// This file is a placeholder to resolve ghost linting errors in the IDE.
export const placeholderFunction = inngest.createFunction(
    { id: "ghost-fix-function", triggers: [{ event: "app/sync" }] },
    async ({ event, step }: { event: any; step: any }) => {
        return { status: "fixed" };
    }
);
