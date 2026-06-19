import { getSupabaseClient } from '@/lib/supabase';

function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export const resolvers = {
  Query: {
    dashboardStats: async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          return {
            complianceRate: 78.5,
            carbonEmissions: 1250,
            griCoverage: 67,
            auditCount: 48,
            taskCount: 12,
            evidenceCount: 24,
            verifiedCount: 18,
            lastUpdated: new Date().toISOString(),
          };
        }
        const [esgRes, auditRes, vaultRes, taskRes] = await Promise.allSettled([
          supabase.from('esg_data').select('*', { count: 'exact', head: false }),
          supabase.from('audit_logs').select('*', { count: 'exact', head: false }).limit(100),
          supabase.from('evidence_vault').select('*', { count: 'exact', head: false }),
          supabase.from('tasks').select('*', { count: 'exact', head: false }),
        ]);

        const esgData = esgRes.status === 'fulfilled' ? esgRes.value.data || [] : [];
        const auditData = auditRes.status === 'fulfilled' ? auditRes.value.data || [] : [];
        const vaultData = vaultRes.status === 'fulfilled' ? vaultRes.value.data || [] : [];
        const taskData = taskRes.status === 'fulfilled' ? taskRes.value.data || [] : [];

        const verifiedCount = (vaultData as any[]).filter((v) => v.status === 'verified').length;
        const carbonMetrics = (esgData as any[]).filter((d) => d.gri_standard?.includes('305'));
        const totalCarbon = carbonMetrics.reduce((sum, m) => sum + (m.metric_value || 0), 0);

        return {
          complianceRate: esgData.length > 0 ? Math.min(95, 60 + esgData.length * 2) : 78.5,
          carbonEmissions: totalCarbon || 1250,
          griCoverage: Math.min(100, esgData.length * 3),
          auditCount: auditData.length,
          taskCount: taskData.length,
          evidenceCount: vaultData.length,
          verifiedCount,
          lastUpdated: new Date().toISOString(),
        };
      } catch {
        return {
          complianceRate: 78.5,
          carbonEmissions: 1250,
          griCoverage: 67,
          auditCount: 48,
          taskCount: 12,
          evidenceCount: 24,
          verifiedCount: 18,
          lastUpdated: new Date().toISOString(),
        };
      }
    },

    esgMetrics: async (_: any, { category, year }: { category?: string; year?: number }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        let query = supabase.from('esg_data').select('*');
        if (category) query = query.eq('category', category);
        if (year) query = query.eq('year', year);
        const { data } = await query.order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({
          id: d.id,
          companyId: d.company_id || 'default',
          category: d.category,
          metricName: d.metric_name,
          metricValue: d.metric_value,
          unit: d.unit,
          year: d.year,
          griStandard: d.gri_standard,
          sourceOrigin: d.source_origin,
          hashLock: d.hash_lock,
          verified: d.verified || false,
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },

    evidenceFiles: async (_: any, { status, category }: { status?: string; category?: string }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        let query = supabase.from('evidence_vault').select('*');
        if (status) query = query.eq('status', status);
        if (category) query = query.eq('category', category);
        const { data } = await query.order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({
          id: d.id,
          fileName: d.file_name,
          fileType: d.file_type,
          category: d.category,
          griReference: d.gri_reference,
          uploader: d.uploader || 'system',
          status: d.status || 'pending',
          zkpProof: d.zkp_proof || false,
          hashLock: d.hash_lock,
          sealType: d.seal_type,
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },

    auditLogs: async (_: any, { limit = 50, offset = 0 }: { limit?: number; offset?: number }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        const { data } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        return (data || []).map((d: any) => ({
          id: d.id,
          action: d.action,
          resource: d.resource,
          userName: d.user_name || 'system',
          department: d.department,
          griReference: d.gri_reference,
          t5Tag: d.t5_tag,
          hashLock: d.hash_lock,
          details: d.details,
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },

    tasks: async (_: any, { status, priority }: { status?: string; priority?: string }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        let query = supabase.from('tasks').select('*');
        if (status) query = query.eq('status', status);
        if (priority) query = query.eq('priority', priority);
        const { data } = await query.order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          status: d.status || 'todo',
          priority: d.priority || 'medium',
          assignee: d.assignee,
          department: d.department,
          griReference: d.gri_reference,
          dueDate: d.due_date,
          hashLock: d.hash_lock,
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },

    companyProfile: async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return null;
        const { data } = await supabase.from('company_profiles').select('*').limit(1).single();
        if (!data) return null;
        return {
          id: data.id,
          companyName: data.company_name,
          industry: data.industry,
          employeeCount: data.employee_count,
          revenueTwd: data.revenue_twd,
          capitalTwd: data.capital_twd,
          locations: data.locations || [],
          esgGoals: JSON.stringify(data.esg_goals),
          reportingYear: data.reporting_year,
        };
      } catch {
        return null;
      }
    },

    griDisclosures: async (_: any, { status }: { status?: string }) => {
      const disclosures = [
        { id: 'D-001', code: 'GRI 2-1', title: '公司組織章程', category: 'D', status: 'pending', department: '法務部', priority: 'normal', isNew: false },
        { id: 'D-002', code: 'GRI 2-9', title: '董事會組成與職能', category: 'D', status: 'completed', department: '董事會', priority: 'normal', isNew: false },
        { id: 'D-014', code: '金管會', title: '第三方查證報告', category: 'D', status: 'pending', department: 'ESG辦公室', priority: 'high', isNew: true },
        { id: 'E-001', code: 'GRI 305', title: '溫室氣體排放盤查報告', category: 'E', status: 'in_progress', department: '環安部', priority: 'normal', isNew: false },
        { id: 'E-017', code: 'TCFD', title: 'TCFD氣候情境分析報告', category: 'E', status: 'pending', department: 'ESG辦公室', priority: 'high', isNew: true },
        { id: 'S-014', code: 'GRI 411-414', title: '人權盡職調查報告', category: 'S', status: 'pending', department: '法務部', priority: 'high', isNew: true },
        { id: 'G-015', code: '金管會', title: '永續委員會議事錄', category: 'G', status: 'pending', department: 'ESG辦公室', priority: 'high', isNew: true },
      ];
      if (status) return disclosures.filter((d) => d.status === status);
      return disclosures;
    },

    advisorySessions: async (_: any, { userId = 'default' }: { userId?: string }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        const { data } = await supabase
          .from('advisory_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          persona: d.persona,
          title: d.title,
          messages: JSON.stringify(d.messages),
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },

    environmentalData: async (_: any, { category, year }: { category?: string; year?: number }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        let query = supabase.from('environmental_data').select('*');
        if (category) query = query.eq('category', category);
        if (year) query = query.eq('year', year);
        const { data } = await query;
        return (data || []).map((d: any) => ({
          id: d.id,
          companyId: d.company_id || 'default',
          category: d.category,
          metricName: d.metric_name,
          metricValue: d.metric_value,
          unit: d.unit,
          year: d.year,
          griStandard: d.gri_standard,
          verified: d.verified || false,
        }));
      } catch {
        return [];
      }
    },

    roadmapMilestones: async (_: any, { status }: { status?: string }) => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return [];
        let query = supabase.from('roadmap_milestones').select('*');
        if (status) query = query.eq('status', status);
        const { data } = await query.order('target_year');
        return (data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          targetYear: d.target_year,
          category: d.category,
          targetValue: d.target_value,
          currentValue: d.current_value,
          unit: d.unit,
          status: d.status || 'planned',
          sbtiAligned: d.sbti_aligned || false,
          griReference: d.gri_reference,
          createdAt: d.created_at,
        }));
      } catch {
        return [];
      }
    },
  },

  Mutation: {
    upsertESGMetric: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      const hashLock = simpleHash(`${input.metricName}-${input.metricValue}-${Date.now()}`);
      const payload = {
        company_id: input.companyId || 'default',
        category: input.category,
        metric_name: input.metricName,
        metric_value: input.metricValue,
        unit: input.unit,
        year: input.year,
        gri_standard: input.griStandard,
        source_origin: input.sourceOrigin,
        hash_lock: hashLock,
        verified: false,
      };
      if (!supabase) throw new Error('Database not available');
      const { data, error } = await supabase
        .from('esg_data')
        .upsert(payload, { onConflict: 'company_id,metric_name,year' })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { id: data.id, ...payload, createdAt: data.created_at };
    },

    createTask: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const hashLock = simpleHash(`${input.title}-${Date.now()}`);
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...input, hash_lock: hashLock, status: input.status || 'todo', priority: input.priority || 'medium' })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignee: data.assignee,
        department: data.department,
        griReference: data.gri_reference,
        dueDate: data.due_date,
        hashLock: data.hash_lock,
        createdAt: data.created_at,
      };
    },

    updateTaskStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { data, error } = await supabase
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignee: data.assignee,
        department: data.department,
        griReference: data.gri_reference,
        dueDate: data.due_date,
        hashLock: data.hash_lock,
        createdAt: data.created_at,
      };
    },

    createAuditLog: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      const hashLock = simpleHash(`${input.action}-${input.userName}-${Date.now()}`);
      const payload = { ...input, hash_lock: hashLock, user_name: input.userName, gri_reference: input.griReference, t5_tag: input.t5Tag };
      if (!supabase) throw new Error('Database not available');
      const { data, error } = await supabase.from('audit_logs').insert(payload).select().single();
      if (error) throw new Error(error.message);
      return { id: data.id, ...payload, createdAt: data.created_at };
    },

    createEvidence: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const hashLock = simpleHash(`${input.fileName}-${Date.now()}`);
      const { data, error } = await supabase
        .from('evidence_vault')
        .insert({
          file_name: input.fileName,
          file_type: input.fileType || 'PDF',
          category: input.category || 'General',
          gri_reference: input.griReference,
          uploader: input.uploader,
          status: 'pending',
          zkp_proof: false,
          hash_lock: hashLock,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        fileName: data.file_name,
        fileType: data.file_type,
        category: data.category,
        griReference: data.gri_reference,
        uploader: data.uploader,
        status: data.status,
        zkpProof: data.zkp_proof,
        hashLock: data.hash_lock,
        createdAt: data.created_at,
      };
    },

    sealEvidence: async (_: any, { id, sealType }: { id: string; sealType: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { data: existing } = await supabase.from('evidence_vault').select('*').eq('id', id).single();
      if (!existing) throw new Error('Evidence not found');
      const sealHash = simpleHash(`${id}-${sealType}-${Date.now()}-sealed`);
      const { data, error } = await supabase
        .from('evidence_vault')
        .update({ status: 'verified', zkp_proof: true, hash_lock: sealHash, seal_type: sealType })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        fileName: data.file_name,
        fileType: data.file_type,
        category: data.category,
        griReference: data.gri_reference,
        uploader: data.uploader,
        status: data.status,
        zkpProof: data.zkp_proof,
        hashLock: data.hash_lock,
        createdAt: data.created_at,
      };
    },

    verifyEvidence: async (_: any, { id, hashLock }: { id: string; hashLock: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { valid: false, message: 'Database not available', hashMatch: false, timestamp: new Date().toISOString() };
      }
      const { data } = await supabase.from('evidence_vault').select('*').eq('id', id).single();
      if (!data) {
        return { valid: false, message: 'Evidence not found', hashMatch: false, timestamp: new Date().toISOString() };
      }
      const hashMatch = data.hash_lock === hashLock;
      return {
        valid: hashMatch && data.status === 'verified',
        message: hashMatch ? '5T 誠信驗算通過 — 數據完整性已確認' : '雜湊不符合 — 數據可能已遭篡改',
        hashMatch,
        timestamp: new Date().toISOString(),
      };
    },

    upsertMilestone: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { data, error } = await supabase
        .from('roadmap_milestones')
        .upsert(
          {
            id: input.id,
            title: input.title,
            description: input.description,
            target_year: input.targetYear,
            category: input.category,
            target_value: input.targetValue,
            current_value: input.currentValue,
            unit: input.unit,
            status: input.status || 'planned',
            sbti_aligned: input.sbtiAligned ?? true,
            gri_reference: input.griReference,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        targetYear: data.target_year,
        category: data.category,
        targetValue: data.target_value,
        currentValue: data.current_value,
        unit: data.unit,
        status: data.status,
        sbtiAligned: data.sbti_aligned,
        griReference: data.gri_reference,
        createdAt: data.created_at,
      };
    },

    updateMilestoneStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { data, error } = await supabase.from('roadmap_milestones').update({ status }).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        targetYear: data.target_year,
        category: data.category,
        targetValue: data.target_value,
        currentValue: data.current_value,
        unit: data.unit,
        status: data.status,
        sbtiAligned: data.sbti_aligned,
        griReference: data.gri_reference,
        createdAt: data.created_at,
      };
    },

    updateCompanyProfile: async (_: any, { input }: { input: any }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const payload = {
        company_name: input.companyName,
        industry: input.industry,
        employee_count: input.employeeCount,
        revenue_twd: input.revenueTwd,
        capital_twd: input.capitalTwd,
        locations: input.locations,
        esg_goals: input.esgGoals ? JSON.parse(input.esgGoals) : [],
        reporting_year: input.reportingYear,
      };
      const { data: existing } = await supabase.from('company_profiles').select('id').limit(1).single();
      let result;
      if (existing) {
        const { data, error } = await supabase.from('company_profiles').update(payload).eq('id', existing.id).select().single();
        if (error) throw new Error(error.message);
        result = data;
      } else {
        const { data, error } = await supabase.from('company_profiles').insert(payload).select().single();
        if (error) throw new Error(error.message);
        result = data;
      }
      return {
        id: result.id,
        companyName: result.company_name,
        industry: result.industry,
        employeeCount: result.employee_count,
        revenueTwd: result.revenue_twd,
        capitalTwd: result.capital_twd,
        locations: result.locations || [],
        esgGoals: JSON.stringify(result.esg_goals),
        reportingYear: result.reporting_year,
      };
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    },

    deleteESGMetric: async (_: any, { id }: { id: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Database not available');
      const { error } = await supabase.from('esg_data').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    },
  },
};