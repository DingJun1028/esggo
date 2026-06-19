import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController.js';
// import { authenticate } from '../middleware/auth'; // 需要 ImpactPassport 權限

const router = Router();

// 專案矩陣路由 (Project Matrix Routes)

// [GET] 獲取所有專案 - 可過濾 ?status=EXECUTION 執行中專案
router.get('/', ProjectController.getProjects);

// [GET] 獲取單一專案詳細資訊 - 以專案 ID 查詢
router.get('/:id', ProjectController.getProjectById);

// [POST] 建立新專案 (Genesis) - 確保 5T 協議中的 Traceable 與透明度
router.post('/', ProjectController.createProject);

// [PATCH] 更新專案狀態 (State Transition) - 狀態轉移 (例如: Trackable -> Calculable)
router.patch('/:id/status', ProjectController.updateProjectStatus);

export default router;
