import { db } from './firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const defaultProjects = [
  { id: 'proj_01', title: '淨灘守護計畫', description: '招募志工進行北海岸淨灘', current_points: 1500, goal_points: 5000, status: 'active', tags: ['環境','海洋'] },
  { id: 'proj_02', title: '偏鄉綠能照明', description: '為偏鄉小學建置太陽能板', current_points: 8200, goal_points: 10000, status: 'active', tags: ['綠能','社會'] },
  { id: 'proj_03', title: '循環包裝設計', description: '研發可重複使用的網購物包裝', current_points: 300, goal_points: 2000, status: 'active', tags: ['循環經濟'] }
];

const defaultMembers = [
  { user_id: 'u_01', name: 'Alice W.', title: '永續領航者', points: 24500, avatar: 'AW' },
  { user_id: 'u_02', name: 'Bob C.', title: '循環實踐家', points: 18200, avatar: 'BC' },
  { user_id: 'u_03', name: 'Charlie D.', title: '綠能先行者', points: 15400, avatar: 'CD' },
  { user_id: 'u_04', name: 'Diana P.', title: '生態守護者', points: 12050, avatar: 'DP' },
  { user_id: 'u_05', name: 'Eve S.', title: '減碳達人', points: 9800, avatar: 'ES' },
];

export async function seedVillageData() {
  try {
    const projectsSnapshot = await getDocs(collection(db, 'village_projects'));
    if (projectsSnapshot.empty) {
      console.log('Seeding village projects...');
      for (const proj of defaultProjects) {
        await setDoc(doc(db, 'village_projects', proj.id), proj);
      }
    }

    const membersSnapshot = await getDocs(collection(db, 'village_members'));
    if (membersSnapshot.empty) {
      console.log('Seeding village members...');
      for (const member of defaultMembers) {
        await setDoc(doc(db, 'village_members', member.user_id), member);
      }
    }
  } catch (error) {
    console.error('Error seeding village data:', error);
  }
}
