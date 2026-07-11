// ============================================================
//  Consulting Time 收集 — Google Apps Script (Web App)
//  接收網頁表單 POST，自動建表並寫入 Google 試算表
// ============================================================
//
//  設計：SHEET_ID 留空時，首次 doPost 會自動建立一張名為
//  "ConsultingTime收集" 的試算表（含 ConsultingTime 分頁與表頭），
//  並把新建的試算表 ID 記在 ScriptProperties，後續寫入同一張。

var SHEET_ID = "";                 // 留空 = 自動建表；也可手動填入既有試算表 ID
var SHEET_NAME = "ConsultingTime";

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = SHEET_ID || props.getProperty("CT_SHEET_ID");
  var ss, sheet;
  if (id) {
    try {
      ss = SpreadsheetApp.openById(id);
      sheet = ss.getSheetByName(SHEET_NAME);
    } catch (e) {
      id = null;
    }
  }
  if (!id || !sheet) {
    ss = SpreadsheetApp.create("ConsultingTime收集");
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
    sheet.appendRow(["時間戳記", "姓名", "Email", "偏好時段", "備註"]);
    props.setProperty("CT_SHEET_ID", ss.getId());
    id = ss.getId();
  }
  return sheet;
}

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter; }
    } else {
      data = e.parameter || {};
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.slot || "",
      data.note || ""
    ]);

    var url = "https://docs.google.com/spreadsheets/d/" +
      PropertiesService.getScriptProperties().getProperty("CT_SHEET_ID") + "/edit";

    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok", sheetUrl: url }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var id = PropertiesService.getScriptProperties().getProperty("CT_SHEET_ID");
  var info = id
    ? ("資料寫入於：https://docs.google.com/spreadsheets/d/" + id + "/edit")
    : "尚未收到資料，首次提交將自動建立試算表。";
  return ContentService
    .createTextOutput("Consulting Time 接收端已上線。" + info)
    .setMimeType(ContentService.MimeType.TEXT);
}
