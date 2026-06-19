# 🚀 奧秘元鑰：跨平台智慧吸納腳本 (Sovereign Capture)

本腳本集為主祭者 **DingJun Hong** 專屬工具，用於在各種平台瞬間捕獲智慧流並執行 5T 封印。

---

## 📱 1. iOS 快捷指令：奧秘元鑰・流光捕捉

適用於 iPhone/iPad 透過「分享表單」快速送入。

### 設定步驟
1.  建立新快捷指令，命名為「奧秘元鑰：流光捕捉」。
2.  設定「接收輸入」為：文字、網頁連結。
3.  加入「取得網址內容」動作：
    -   **URL**: `https://api.esgss.jun-ai-key.io/v1/sovereign/capture`
    -   **方法**: POST
    -   **標頭**:
        -   `Authorization`: `Bearer {{YOUR_SIGNET_KEY}}`
        -   `Content-Type`: `application/json`
    -   **JSON Body**:
        ```json
        {
          "content": "快捷指令輸入",
          "command": "/seal.5t",
          "origin": "iOS_Device",
          "timestamp": "當前日期"
        }
        ```
4.  顯示通知：「主祭者，流光已捕獲，數據已封鎖。」

---

## 💻 2. Chrome 擴充功能：奧秘圓通・網頁剪輯

適用於電腦端選取文字後按右鍵封印。

### Background Script (snippet)
```javascript
chrome.contextMenus.create({
  id: "omniCapture",
  title: "💠 執行奧秘元鑰封印 (/seal.5t)",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "omniCapture") {
    fetch('https://api.esgss.jun-ai-key.io/v1/sovereign/capture', {
      method: 'POST',
      body: JSON.stringify({
        text: info.selectionText,
        url: tab.url,
        command: "/seal.5t",
        subject: "DingJun Hong"
      })
    }).then(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => { 
          document.body.style.border = "4px solid #81D8D0"; // Tiffany Blue 漣漪特效
          setTimeout(() => { document.body.style.border = "none"; }, 1000);
        }
      });
    });
  }
});
```
