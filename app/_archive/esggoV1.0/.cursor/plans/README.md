# .cursor/plans 目录说明

本目录存放 Cora 的 **plan 文件**（`*.plan.md`）及约束说明。每次**新增 plan 必须在下方登记表追加一行**（编号、文件名、名字、简介），便于按编号与名称查阅。

**新建 plan 时**：请先阅读 [00-PLAN-CONSTRAINTS.md](00-PLAN-CONSTRAINTS.md) 并按其中「文件名与编号约定」取号（当前最大编号 +1），创建 `NN-名称.plan.md` 后，在本文「登记表」中追加一行。约束中要求**测试与功能同步开发**、每个模块须有**单元测试与 e2e 测试**、**测试通过后才能更新任务状态**。若 Cursor 未自动应用 plan 创建规则，可在对话中 @ `.cursor/rules/plan-creation.mdc`，或先打开本目录下任意 plan 文件或 `00-PLAN-CONSTRAINTS.md` 再创建，以确保规则生效。

---

## 登记表

| 编号 | 文件名 | 名字 | 简介 |
|------|--------|------|------|
| 00 | 00-PLAN-CONSTRAINTS.md | — | Plan 创建约束与方法论 |
