import { useState, useEffect } from 'react';
import { createClient } from './client';

export function useESGAtoms(domain: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAtoms = async () => {
    setLoading(true);
    try {
      const { data: atoms, error } = await supabase
        .from('esg_atoms')
        .select('*')
        .filter('evidence->>domain', 'eq', domain)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ESG Atoms for ${domain}:`, error);
        return;
      }

      // Transform generic atoms into dashboard-friendly format
      const formatted = (atoms as any[] || []).map((atom: any) => ({
        id: atom.uuid,
        status: atom.status === 'Trustworthy' ? 'Sealed' : 'Pending',
        hash_lock: atom.hash_lock,
        timestamp: atom.created_at,
        ...atom.evidence
      }));
      
      setData(formatted);
    } catch (err) {
      console.error('Exception fetching ESG Atoms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtoms();
  }, [domain]);

  return { data, loading, refetch: fetchAtoms };
}
