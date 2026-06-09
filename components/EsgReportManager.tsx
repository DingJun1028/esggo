import React, { useState, useEffect, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, User } from 'firebase/auth'; // Assuming Firebase Auth is initialized elsewhere

// Define the interface for an ESG report, matching the backend and Firestore rules
interface EsgReport {
  id: string;
  title: string;
  year: number;
  status: 'draft' | 'completed';
  progress: number;
  sections?: { [key: string]: any };
  createdAt?: Date; // Convert Firestore Timestamp to Date on frontend
  updatedAt?: Date; // Convert Firestore Timestamp to Date on frontend
  userId: string; // Add userId for display/debug purposes
}

// Define the payload structure for the callable function
interface ManageEsgReportsPayload {
  action: 'create' | 'get' | 'list' | 'update' | 'delete';
  payload?: any; // Specific payload varies by action
}

const EsgReportManager: React.FC = () => {
  const [reports, setReports] = useState<EsgReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newReportTitle, setNewReportTitle] = useState<string>('');
  const [newReportYear, setNewReportYear] = useState<string>('');
  const [user, setUser] = useState<User | null>(null); // Firebase user object

  const functions = getFunctions();
  const auth = getAuth(); // Get auth instance

  // Reference to the callable function
  const manageEsgReports = httpsCallable<ManageEsgReportsPayload, { data: EsgReport[] | EsgReport | { message: string } }>(functions, 'manageEsgReports');

  const fetchEsgReports = useCallback(async () => {
    if (!user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await manageEsgReports({ action: 'list', payload: { userId: user.uid } });
      setReports(result.data as EsgReport[]);
    } catch (err: unknown) { // Use unknown for caught errors
      console.error('Error fetching ESG reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  }, [user, manageEsgReports]); // Add manageEsgReports to dependencies

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchEsgReports();
      } else {
        setReports([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, user, fetchEsgReports]); // Add auth and fetchEsgReports to dependencies

  const handleCreateReport = async () => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    if (!newReportTitle || !newReportYear) {
      setError('Title and Year are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newReportData = {
        title: newReportTitle,
        year: parseInt(newReportYear),
        status: 'draft',
        progress: 0,
        // userId will be added by the Cloud Function for security rules
      };
      await manageEsgReports({ action: 'create', payload: newReportData });
      setNewReportTitle('');
      setNewReportYear('');
      fetchEsgReports(); // Refresh the list
    } catch (err: unknown) { // Use unknown for caught errors
      console.error('Error creating ESG report:', err);
      setError(err instanceof Error ? err.message : 'Failed to create report.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await manageEsgReports({ action: 'delete', payload: { reportId } });
      fetchEsgReports(); // Refresh the list
    } catch (err: unknown) { // Use unknown for caught errors
      console.error('Error deleting ESG report:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete report.');
    } finally {
      setLoading(false);
    }
  };

  // Simplified UI for demonstration. Full CRUD would include update/get forms.
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ESG Report Manager</h2>

      {!user ? (
        <p className="text-red-500 mb-4">Please sign in to manage ESG reports.</p>
      ) : (
        <>
          <div className="mb-6 p-4 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Create New Report</h3>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Report Title"
                value={newReportTitle}
                onChange={(e) => setNewReportTitle(e.target.value)}
                className="p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Report Year"
                value={newReportYear}
                onChange={(e) => setNewReportYear(e.target.value)}
                className="p-2 border rounded-md"
              />
              <button
                onClick={handleCreateReport}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Report'}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <h3 className="text-xl font-semibold mb-4">Your Reports</h3>
          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p>No ESG reports found. Create one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg shadow-sm bg-white">
                  <h4 className="text-lg font-bold">{report.title} ({report.year})</h4>
                  <p>Status: {report.status}</p>
                  <p>Progress: {report.progress}%</p>
                  <p className="text-sm text-gray-500">Created: {report.createdAt?.toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Last Updated: {report.updatedAt?.toLocaleDateString()}</p>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    disabled={loading}
                    className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md disabled:opacity-50 text-sm"
                  >
                    Delete
                  </button>
                  {/* Add an "Edit" button here later */}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EsgReportManager;
