// ============================================================
//  Consulting Time 收集 — Google Apps Script (Web App)
//  用途：接收網頁表單 POST，寫入 Google 試算表
//  部署方式見同目錄 apps_script_部署步驟.txt
// ============================================================
//
// 第一次部署前，請先建立一張 Google 試算表，
// 在第一列手動寫好表頭：時間戳記 | 姓名 | Email | 偏好時段 | 備註
// 然後把下面的 SHEET_ID 換成該試算表網址裡的 ID。

var SHEET_ID = "請換成你的試算表ID"; // 例如 1A2B3C...xyz
var SHEET_NAME = "ConsultingTime";     // 工作表分頁名稱，可自訂

function doPost(e) {
  try {
    var data;
    // 前端用 JSON body 送來；也相容 form-urlencoded
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && Object.keys(e.parameter).length) {
      data = e.parameter;
    } else {
      data = {};
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.slot || "",
      data.note || ""
    ]);

    // 回傳 JSON（前端用 no-cors，拿不到內容，但狀態碼 200 即可）
    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 方便手動測試：瀏覽器開 Web App URL 時回一句話
function doGet(e) {
  return ContentService
    .createTextOutput("Consulting Time 接收端已上線。請用 POST 送資料。")
    .setMimeType(ContentService.MimeType.TEXT);
}
