import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ProjectModel as Project, ProjectData } from '../models/Project.js';
import { IImpactProject } from '../types/ipms.js';
import { BlockchainService } from '../services/BlockchainService.js';
import { LogicState } from '../types/core.js';

import { RuneService } from '../services/RuneService.js';
import { EntropyService } from '../services/EntropyService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../services/ErrorHandler.js';

export class ProjectController {
  /**
   * GET /api/projects
   * ???????謅?(Persistent + Computed Entropy)
   */
  public static getProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;
    // Map 'status' query param to 'lifecycle_state' if provided
    const filter = status ? { lifecycle_state: status as 'TRACEABLE' | 'VERIFIED' | 'IMMUTABLE' } : {};

    const projects = await Project.find(filter).sort({}).lean();

    const data = projects.map(p => ({
      ...p,
      id: p.id?.toString() || p.uuid, // Convert number id to string
      uuid: p.uuid,
      progress: EntropyService.calculateProgress(p as unknown as IImpactProject),
    }));

    res.status(200).json({
      success: true,
      data,
      meta: {
        count: data.length,
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * GET /api/projects/:id
   * ????獢??????? (Persistent + Computed Entropy)
   */
  public static getProjectById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const projectDoc = await Project.findOne({ uuid: id }).lean();

    if (!projectDoc) {
      throw new AppError('Project Asset Not Found in Matrix', 404, 'ASSET_NOT_FOUND');
    }

    const project: IImpactProject = {
      ...projectDoc,
      id: projectDoc.id?.toString() || projectDoc.uuid, // Convert number to string
      progress: EntropyService.calculateProgress(projectDoc as unknown as IImpactProject),
    };

    res.status(200).json({ success: true, data: project });
  });

  /**
   * POST /api/projects
   * ?????? (Project Genesis - Persistent)
   */
  public static createProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, owner_id, budget, impact_metric, impact_target, source_doc } = req.body;

    if (!title || !owner_id || !impact_metric) {
      throw new AppError('Missing Core DNA (Title, Owner, Metric)', 400, 'BAD_REQUEST');
    }

    const now = Date.now();
    const projectUuid = uuidv4();

    const projectData: Omit<ProjectData, 'id'> = {
      uuid: projectUuid,
      title,
      lifecycle_state: 'TRACEABLE',
      impact_goals: {
        target_metric: impact_metric,
        target_value: impact_target || 0,
        current_value: 0,
        formula_ref: 'Pending_Algorithm_Selection',
      },
      resources: {
        budget_allocated: budget || 0,
        man_hours_estimated: 0,
        team_members: [owner_id],
      },
      progress: 0,
      metadata: {
        version: '1.0.0',
        created_at: now,
        owner_id,
        status: 'PLANNING',
        evidence: {
          source_origin: source_doc || 'Manual Initiation via IPMS Console',
          raw_data_hash: `hash_genesis_${now}_${Math.floor(Math.random() * 9999)}`,
          verified_by: 'System_Genesis_Protocol',
          timestamp: now,
        },
      },
    };

    const newProject = await Project.create(projectData);

    console.log(`[IPMS] New Asset Minted to DB: ${newProject.uuid} [TRACEABLE]`);

    res.status(201).json({
      success: true,
      message: 'Project Genesis Successful',
      data: newProject,
    });
  });

  /**
   * 🔄 更新項目狀態（State Transition Logic）
   * PATCH /api/projects/:id/status
   */
  public static updateProjectStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { lifecycle_state, status, evidence_update } = req.body;

    // Fetch current project
    const currentProject = await Project.findOne({ uuid: id }).lean();
    if (!currentProject) {
      throw new AppError('Project Asset Not Found in Matrix', 404, 'ASSET_NOT_FOUND');
    }

    // Prepare updates object
    const updates: Partial<ProjectData> = {};
    const currentMetadata = currentProject.metadata || {};

    // Handle lifecycle state transition
    if (lifecycle_state && lifecycle_state !== currentProject.lifecycle_state) {
      const validTransitions: Record<string, string[]> = {
        TRACEABLE: ['VERIFIED'],
        VERIFIED: ['IMMUTABLE'],
        IMMUTABLE: [],
      };

      const allowed = validTransitions[currentProject.lifecycle_state] || [];
      if (!allowed.includes(lifecycle_state)) {
        throw new AppError(
          `Invalid State Transition: ${currentProject.lifecycle_state} -> ${lifecycle_state}`,
          400,
          'INVALID_TRANSITION'
        );
      }

      updates.lifecycle_state = lifecycle_state as 'TRACEABLE' | 'VERIFIED' | 'IMMUTABLE';

      // Blockchain minting for IMMUTABLE state
      if (lifecycle_state === 'IMMUTABLE') {
        console.log(`[IPMS] Minting Blockchain Asset for Project: ${id}`);
        try {
          const projectForMint = {
            ...currentProject,
            id: currentProject.uuid,
            progress: EntropyService.calculateProgress(currentProject as unknown as IImpactProject),
          };

          const blockchainResult = await BlockchainService.mintAsset(projectForMint as unknown as IImpactProject);
          console.log(`[IPMS] Blockchain Mint Success: ${blockchainResult.tx_hash}`);

          // Update evidence with blockchain data
          currentMetadata.evidence = {
            ...(currentMetadata.evidence || {}),
            source_origin: 'AVOS_BLOCKCHAIN_NODE',
            raw_data_hash: blockchainResult.tx_hash,
            verified_by: `Signer: ${blockchainResult.signer_address.slice(0, 6)}...`,
            timestamp: blockchainResult.block_timestamp,
          };
          updates.metadata = currentMetadata;

          console.log(`[RUNE BRIDGE] Asset Minted: ${blockchainResult.tx_hash}`);
        } catch (mintError) {
          console.error('[IPMS Error] Blockchain Minting Failed:', mintError);
          // Continue with state update even if blockchain minting fails
        }
      }
    }

    // Handle status update (stored in metadata)
    if (status) {
      currentMetadata.status = status;
      updates.metadata = currentMetadata;
    }

    // Handle evidence update
    if (evidence_update) {
      currentMetadata.evidence = {
        ...(currentMetadata.evidence || {}),
        ...evidence_update,
        timestamp: Date.now(),
      };
      updates.metadata = currentMetadata;
    }

    // Execute update
    const updatedProject = await Project.update(id, updates);

    if (!updatedProject) {
      throw new AppError('Failed to Update Project', 500, 'UPDATE_FAILED');
    }

    res.status(200).json({
      success: true,
      message: 'Project State Updated Successfully',
      data: updatedProject,
    });
  });
}
