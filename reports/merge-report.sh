#!/bin/bash
# 整合報告書章節為完整版本
# bash /c/Project/esggo/reports/merge-report.sh

OUTPUT="/c/Project/esggo/reports/esg-sustainability-report-2026.html"
COVER="/c/Project/esggo/reports/esg-sustainability-report-2026-cover.html"
COMPLIANCE="/c/Project/esggo/reports/esg-sustainability-report-2026-compliance.html"
CH1_4="/c/Project/esggo/reports/esg-sustainability-report-2026-ch1-4.html"
CH5_8="/c/Project/esggo/reports/esg-sustainability-report-2026-ch5-8.html"
FOOTER="/c/Project/esggo/reports/esg-sustainability-report-2026-footer.html"

# 頁尾
cat > "$FOOTER" << 'FOOTER_EOF'
<hr>
<div class="footer">
<p>善向永續股份有限公司 2026 年永續報告書</p>
<p>報告期間：2026 年 1 月 1 日至 2026 年 12 月 31 日</p>
<p>發行日期：2026 年 8 月</p>
<p>董事長：楊坤修 博士 | 地址：台北市中正區館前路 20 號 5 樓</p>
<p>本報告書已取得第三方有限確信（Limited Assurance），確信報告書編號：ESG-SUN-2026-001</p>
<p>© 2026 ESG Sunshine Co., Ltd. All Rights Reserved.</p>
</div>
</body>
</html>
FOOTER_EOF

# 整合
cat "$COVER" "$COMPLIANCE" "$CH1_4" "$CH5_8" "$FOOTER" > "$OUTPUT"

echo "報告書已整合完成：$OUTPUT"
wc -c "$OUTPUT"
FOOTER_EOF
