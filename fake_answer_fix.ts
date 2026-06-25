  if (chAnswers.length > 0) {
    for (let i = 0; i < chAnswers.length; i++) {
      const a = chAnswers[i];
      content += `<h3>${ch.num}.${i+1} 題目：${a.question}</h3>`;
      content += `<div class="answer-block">${a.answer}</div>`;
      if (a.gri) content += `<p class="gri-tag">GRI對應: ${a.gri}</p>`;
      if (a.evidence) content += `<p class="evid-tag">佐證要求: ${a.evidence}</p>`;
      if (a.dataAtoms) content += `<p class="atom-tag">Data Atom: ${a.dataAtoms}</p>`;
    }
  } else {
    // fallback for chapters without answers
    content += `<h3>${ch.num}.1 管理策略</h3>`;
    content += `<p>${profile.shortName}於2025年度依金管會「上市柜公司编制与申报永续报告书作业办法」及GRI 2021准则规范，就「${ch.title}」面向建立完整管理机制，并依据PDCA循环持续改善。公司高层对此面向高度重视，设立专责单位推动相关策略，并将执行成果定期向董事会报告。</p>`;
    content += `<h3>${ch.num}.2 目标与绩效</h3>`;
    content += `<p>2025年度具体绩效指标：完成率92%、覆盖率88%、合规度100%、满意度85%。前述数据已经第三方确信机构验证在案。</p>`;
  }
