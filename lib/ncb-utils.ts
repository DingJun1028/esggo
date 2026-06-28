/**
 * no-code backend utilities (NCB) - village service for member management
 */
export const ncbVillageService = {
  async getVillageMembers() {
    return [
      { user_id: 'u_01', name: 'Alice W.', title: '永續領航者', points: 24500, avatar: 'AW' },
      { user_id: 'u_02', name: 'Bob C.', title: '循環實踐家', points: 18200, avatar: 'BC' },
      { user_id: 'u_03', name: 'Charlie D.', title: '綠能先行者', points: 15400, avatar: 'CD' },
      { user_id: 'u_04', name: 'Diana P.', title: '生態守護者', points: 12050, avatar: 'DP' },
      { user_id: 'u_05', name: 'Eve S.', title: '減碳達人', points: 9800, avatar: 'ES' },
    ];
  },
};