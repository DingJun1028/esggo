'use client';
import { useState, useEffect } from 'react';
import { Leaf, Heart, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, increment, query, orderBy } from 'firebase/firestore';
import { seedVillageData } from '@/lib/village-seeder';

const C = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  teal: '#009EB0',
  gold: '#D4AF37',
  green: '#22C55E',
  text: '#0F172A',
  muted: '#64748B',
  surface: '#F1F5F9',
};

interface Project {
  id: string;
  title: string;
  description: string;
  current_points: number;
  goal_points: number;
  status: string;
  tags: string[];
}

interface Member {
  user_id: string;
  name: string;
  title: string;
  points: number;
  avatar: string;
}

export default function VillagePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProjects: () => void;
    let unsubscribeMembers: () => void;

    async function initializeAndListen() {
      try {
        // Ensure initial data exists
        await seedVillageData();

        // Listen to projects
        const projectsQuery = query(collection(db, 'village_projects'));
        unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
          const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
          // sort by current_points descending for display (or id if we want stable order)
          projs.sort((a, b) => b.current_points - a.current_points);
          setProjects(projs);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching projects:", error);
          setFetchError("無法取得即時專案資料");
        });

        // Listen to members
        const membersQuery = query(collection(db, 'village_members'), orderBy('points', 'desc'));
        unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
          const mems = snapshot.docs.map(doc => ({ user_id: doc.id, ...doc.data() }) as Member);
          setMembers(mems);
        }, (error) => {
          console.error("Error fetching members:", error);
          setFetchError("無法取得即時成員資料");
        });

      } catch (err) {
        console.error("Initialization error:", err);
        setFetchError("初始化失敗");
        setLoading(false);
      }
    }

    initializeAndListen();

    return () => {
      if (unsubscribeProjects) unsubscribeProjects();
      if (unsubscribeMembers) unsubscribeMembers();
    };
  }, []);

  const handleVote = async (projectId: string) => {
    try {
      const projectRef = doc(db, 'village_projects', projectId);
      // We assume user 'u_01' is the current logged-in user for demonstration
      const currentUserId = 'u_01'; 
      const memberRef = doc(db, 'village_members', currentUserId);

      // Increment points atomically in Firestore
      await updateDoc(projectRef, {
        current_points: increment(10)
      });
      await updateDoc(memberRef, {
        points: increment(10)
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '網路連線失敗';
      alert('投票失敗: ' + message);
    }
  };

  const safeProgress = (current: number, goal: number) => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Noto Sans TC', sans-serif", padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #009EB0, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Leaf color="#fff" size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.teal }}>
            善向永續村 (Village)
          </h1>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            基於 5T 協議的去中心化永續社群與影響力募資平台
          </div>
        </div>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div style={{ padding: 12, marginBottom: 16, borderRadius: 8, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: 13 }}>
          ⚠️ {fetchError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left Column: Impact Projects */}
        <div>
          <h2 style={{ fontSize: 18, color: C.teal, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} /> 影響力專案募資
          </h2>
          {loading ? (
            <div style={{ color: C.muted }}>載入中...</div>
          ) : projects.length === 0 ? (
            <div style={{ color: C.muted, textAlign: 'center', padding: 40 }}>尚無專案</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {projects.map(proj => {
                const progress = safeProgress(proj.current_points, proj.goal_points);
                return (
                  <div key={proj.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: 4, width: `${progress}%`, background: 'linear-gradient(90deg, #009EB0, #22C55E)', transition: 'width 0.5s ease' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: C.text }}>{proj.title}</h3>
                        <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{proj.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {proj.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 11, background: '#F0FDFA', color: C.teal, padding: '4px 8px', borderRadius: 100 }}>#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24 }}>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: C.gold, fontFamily: "'Fira Code', monospace" }}>
                          {proj.current_points.toLocaleString()} <span style={{ fontSize: 12, color: C.muted }}>/ {proj.goal_points.toLocaleString()} PTS</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.green, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <ShieldCheck size={14} /> 5T ZKP 已驗證
                        </div>
                      </div>

                      <button onClick={() => handleVote(proj.id)} style={{ background: C.teal, border: 'none', color: '#FFF', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <Heart size={16} /> 贊助 (10 PTS)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard */}
        <div>
          <h2 style={{ fontSize: 18, color: C.gold, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Users size={18} /> 村民貢獻榜
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {loading ? (
              <div style={{ color: C.muted }}>載入中...</div>
            ) : members.length === 0 ? (
              <div style={{ color: C.muted, textAlign: 'center', padding: 20 }}>尚無成員</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {members.map((mem, i) => (
                  <div key={mem.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: C.surface, borderRadius: 12, border: i === 0 ? `1px solid ${C.gold}50` : '1px solid transparent' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 0 ? C.gold : C.teal, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                      {mem.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{mem.name}</div>
                        {i === 0 && <span style={{ fontSize: 10, background: C.gold, color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>TOP 1</span>}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{mem.title}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: "'Fira Code', monospace" }}>
                      {mem.points.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
