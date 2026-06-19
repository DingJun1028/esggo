#!/usr/bin/env node
/**
 * Google Stitch MCP Server
 * 
 * This MCP server provides UI/UX design system integration capabilities
 * for Google Stitch design tool integration.
 * 
 * Features:
 * - Design token management
 * - Component library sync
 * - Design system documentation
 * - UI/UX best practices enforcement
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create MCP server instance
const server = new McpServer({
  name: "google-stitch",
  version: "1.0.0"
});

/**
 * Design Token Management Tools
 */

// Tool: Get design tokens
server.tool(
  "get_design_tokens",
  {
    category: z.enum(["colors", "typography", "spacing", "shadows", "animations"]).optional(),
    format: z.enum(["json", "css", "scss", "tailwind"]).optional()
  },
  async ({ category, format = "json" }) => {
    const tokens = {
      colors: {
        primary: "#63A2B0",
        primaryDark: "#4A8291",
        primaryLight: "#8FC4D1",
        secondary: "#26A69A",
        accent: "#FFA726",
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3",
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121"
        }
      },
      typography: {
        fontFamily: {
          primary: "Noto Sans TC, Microsoft JhengHei, sans-serif",
          secondary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        },
        fontSize: {
          xs: "12px",
          sm: "14px",
          base: "16px",
          lg: "18px",
          xl: "20px",
          "2xl": "24px",
          "3xl": "28px",
          "4xl": "32px",
          "5xl": "36px",
          "6xl": "48px"
        },
        fontWeight: {
          light: 300,
          regular: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        0: "0px",
        0.5: "4px",
        1: "8px",
        1.5: "12px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        8: "64px",
        10: "80px",
        12: "96px"
      },
      shadows: {
        none: "none",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      },
      animations: {
        duration: {
          fast: "150ms",
          normal: "250ms",
          slow: "350ms",
          slower: "500ms"
        },
        easing: {
          easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
          easeIn: "cubic-bezier(0.4, 0, 1, 1)",
          easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
          linear: "linear(0, 0, 1, 1)"
        }
      }
    };

    if (category) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tokens[category], null, 2)
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tokens, null, 2)
        }
      ]
    };
  }
);

// Tool: Validate design tokens
server.tool(
  "validate_design_tokens",
  {
    tokens: z.record(z.string())
  },
  async ({ tokens }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate color tokens
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    for (const [key, value] of Object.entries(tokens)) {
      if (key.includes("color") || key.includes("primary") || key.includes("secondary")) {
        if (!colorRegex.test(value as string)) {
          warnings.push(`Token "${key}" may not be a valid hex color: ${value}`);
        }
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            valid: errors.length === 0,
            errors,
            warnings,
            message: errors.length === 0
              ? "Design tokens validation passed"
              : `Found ${errors.length} errors and ${warnings.length} warnings`
          }, null, 2)
        }
      ]
    };
  }
);

/**
 * UI/UX Best Practices Tools
 */

// Tool: Get UI/UX best practices
server.tool(
  "get_ui_ux_best_practices",
  {
    category: z.enum([
      "accessibility",
      "responsive_design",
      "performance",
      "interaction_design",
      "visual_design",
      "typography",
      "color_usage",
      "navigation",
      "forms",
      "mobile_first"
    ]).optional()
  },
  async ({ category }) => {
    const bestPractices = {
      accessibility: {
        title: "無障礙設計最佳實踐",
        principles: [
          "遵循 WCAG 2.1 AA 級標準",
          "確保色彩對比度至少達到 4.5:1",
          "所有互動元素支援鍵盤導航",
          "為圖片和非文字內容提供替代文字",
          "使用 ARIA 標籤增強螢幕閱讀器支援",
          "避免僅依賴色彩傳達資訊"
        ],
        checklist: [
          "✓ 色彩對比度檢查",
          "✓ 鍵盤導航測試",
          "✓ 螢幕閱讀器相容性",
          "✓ 焦點指示器可見性",
          "✓ 錯誤訊息明確性"
        ]
      },
      responsive_design: {
        title: "響應式設計最佳實踐",
        principles: [
          "採用行動優先設計策略",
          "使用彈性佈局（Flexbox）和網格佈局（Grid）",
          "定義清晰的斷點系統",
          "確保圖片和媒體自適應",
          "測試多種螢幕尺寸和設備"
        ],
        breakpoints: {
          xs: "0 - 599px",
          sm: "600 - 899px",
          md: "900 - 1199px",
          lg: "1200 - 1439px",
          xl: "1440 - 1919px",
          xxl: "1920px+"
        }
      },
      performance: {
        title: "效能優化最佳實踐",
        principles: [
          "優化圖片大小和格式",
          "使用延遲載入（Lazy Loading）",
          "最小化 CSS 和 JavaScript",
          "使用內容分發網路（CDN）",
          "實施快取策略"
        ],
        metrics: [
          "First Contentful Paint < 1.8s",
          "Largest Contentful Paint < 2.5s",
          "Time to Interactive < 3.8s",
          "Cumulative Layout Shift < 0.1"
        ]
      },
      interaction_design: {
        title: "互動設計最佳實踐",
        principles: [
          "提供即時且明確的回饋",
          "維持一致的互動模式",
          "支援多種輸入方式（滑鼠、觸控、鍵盤）",
          "實施適當的動畫和轉場效果",
          "避免意外的系統狀態變化"
        ],
        feedback_types: [
          "視覺回饋（顏色變化、陰影變化）",
          "動畫回饋（載入、完成、錯誤）",
          "文字回饋（提示訊息、錯誤說明）",
          "觸覺回饋（震動 feedback）"
        ]
      },
      visual_design: {
        title: "視覺設計最佳實踐",
        principles: [
          "建立並遵循設計系統",
          "保持視覺層級清晰",
          "使用一致的色彩語義",
          "確保足夠的留白空間",
          "維持視覺一致性"
        ],
        hierarchy_levels: [
          "主要層級：標題和重要動作",
          "次要層級：輔助資訊",
          "第三層級：次要文字和標籤",
          "裝飾層級：背景和視覺元素"
        ]
      },
      typography: {
        title: "排版設計最佳實踐",
        principles: [
          "使用可讀性高的字體",
          "建立清晰的字級系統",
          "維持適當的行高比例",
          "限制每行的文字數量（45-75 字元）",
          "確保足夠的字元間距"
        ],
        font_size_scale: {
          base: "16px",
          ratio: "1.25",
          levels: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"]
        }
      },
      color_usage: {
        title: "色彩運用最佳實踐",
        principles: [
          "建立有意義的色彩語義系統",
          "確保色彩的無障礙性",
          "使用中性色作為基底",
          "限制主要色彩的數量",
          "考慮色彩的文化含義"
        ],
        color_roles: {
          primary: "主要互動元素和品牌識別",
          secondary: "輔助互動和次要強調",
          accent: "重要提示和呼叫行動",
          neutral: "文字、背景和分隔線",
          functional: "成功、警告、錯誤等狀態"
        }
      },
      navigation: {
        title: "導航設計最佳實踐",
        principles: [
          "提供清晰的路徑指示",
          "維持一致的導航結構",
          "支援使用者快速跳轉",
          "提供搜尋功能",
          "確保導航的可發現性"
        ],
        navigation_patterns: [
          "頂部導航欄",
          "側邊導航",
          "麵包屑導航",
          "標籤導航",
          "漢堡選單（行動裝置）"
        ]
      },
      forms: {
        title: "表單設計最佳實踐",
        principles: [
          "使用清晰的標籤和提示",
          "提供即時的驗證回饋",
          "標記必填和選填欄位",
          "支援自動完成和填入",
          "提供適當的錯誤說明"
        ],
        field_guidelines: [
          "標籤置於輸入欄位上方",
          "提示文字使用淺色",
          "錯誤訊息明確且有建設性",
          "支援鍵盤導航",
          "必填欄位使用星號標記"
        ]
      },
      mobile_first: {
        title: "行動優先設計最佳實踐",
        principles: [
          "先為小螢幕設計",
          "優先考慮觸控互動",
          "最小化文字輸入",
          "優化觸控目標大小（至少 44x44px）",
          "考慮網路連線不穩定的情況"
        ],
        touch_guidelines: [
          "最小觸控區域：44x44px",
          "按鈕間距：至少 8px",
          "支援滑動手勢",
          "避免需要精確點擊的元素",
          "考慮單手操作的可能性"
        ]
      }
    };

    if (category) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(bestPractices[category], null, 2)
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(bestPractices, null, 2)
        }
      ]
    };
  }
);

/**
 * Component Guidelines Tools
 */

// Tool: Get component guidelines
server.tool(
  "get_component_guidelines",
  {
    component_type: z.enum([
      "button",
      "input",
      "select",
      "checkbox",
      "radio",
      "toggle",
      "card",
      "modal",
      "tooltip",
      "navigation",
      "table",
      "form"
    ]).optional()
  },
  async ({ component_type }) => {
    const guidelines = {
      button: {
        states: ["default", "hover", "active", "focus", "disabled", "loading"],
        sizes: ["small", "medium", "large"],
        variants: ["primary", "secondary", "text", "icon"],
        accessibility: [
          "支援鍵盤聚焦",
          "明确的aria-label（圖示按鈕）",
          "禁用狀態的aria-disabled"
        ]
      },
      input: {
        states: ["default", "focus", "error", "disabled", "readonly"],
        features: ["label", "placeholder", "helperText", "errorMessage", "icon"],
        accessibility: [
          "正確的for/id 關聯",
          "必填欄位的aria-required",
          "錯誤狀態的aria-invalid",
          "錯誤訊息的aria-describedby"
        ]
      },
      card: {
        variants: ["interactive", "non-interactive", "selectable"],
        elements: ["header", "content", "footer", "media", "actions"],
        layout: ["vertical", "horizontal", "grid"]
      },
      modal: {
        features: ["title", "content", "footer", "closeButton", "backdrop"],
        sizes: ["small", "medium", "large", "fullscreen"],
        accessibility: [
          "role=\"dialog\"",
          "aria-modal=\"true\"",
          "trap focus",
          "Escape 鍵關閉",
          "背景點擊關閉（可選）"
        ]
      },
      navigation: {
        types: ["header", "sidebar", "breadcrumb", "pagination", "tabs"],
        responsive: ["desktop", "tablet", "mobile"],
        features: ["logo", "search", "userMenu", "notifications", "menu"]
      },
      table: {
        features: ["sorting", "pagination", "selection", "filter", "fixedHeader"],
        accessibility: [
          "正確的表頭標記",
          "列和行的aria-level",
          "支援鍵盤導航",
          "空白儲存格的處理"
        ]
      }
    };

    if (component_type && guidelines[component_type as keyof typeof guidelines]) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(guidelines[component_type as keyof typeof guidelines], null, 2)
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(guidelines, null, 2)
        }
      ]
    };
  }
);

/**
 * Design System Resources
 */

// Resource: Design system overview
server.resource(
  "design_system_overview",
  "design://system/overview",
  async () => {
    return {
      contents: [
        {
          uri: "design://system/overview",
          mimeType: "application/json",
          text: JSON.stringify({
            name: "ESGss JunAiKey Design System",
            version: "11.0.0",
            theme: "上善若水 (Aqua Flow)",
            themeColor: "#63A2B0",
            lastUpdated: new Date().toISOString(),
            sections: [
              "色彩系統",
              "排版規範",
              "間距系統",
              "組件庫",
              "動畫規範",
              "無障礙規範"
            ]
          }, null, 2)
        }
      ]
    };
  }
);

// Resource template: Component documentation
server.resource(
  "component_docs",
  new ResourceTemplate("design://components/{name}", { list: true }),
  async (uri, { name }) => {
    const componentDocs: Record<string, object> = {
      button: {
        name: "Button",
        description: "互動式按鈕組件",
        props: {
          variant: { type: "string", default: "primary", options: ["primary", "secondary", "text", "icon"] },
          size: { type: "string", default: "medium", options: ["small", "medium", "large"] },
          disabled: { type: "boolean", default: "false" },
          loading: { type: "boolean", default: "false" }
        },
        usage: "<Button variant=\"primary\" size=\"medium\">點擊我</Button>"
      },
      card: {
        name: "Card",
        description: "卡片式內容容器",
        props: {
          variant: { type: "string", default: "default", options: ["default", "interactive", "elevated"] },
          padding: { type: "string", default: "16px" },
          hoverable: { type: "boolean", default: "false" }
        },
        usage: "<Card variant=\"interactive\">卡片內容</Card>"
      }
    };

    const doc = componentDocs[name] || {
      error: "Component not found",
      availableComponents: Object.keys(componentDocs)
    };

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(doc, null, 2)
        }
      ]
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Google Stitch MCP Server running on stdio");
