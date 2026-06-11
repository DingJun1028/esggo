// lib/stitch-rest-client.ts
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';



const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export async function listStitchProjectsREST() {
  const client = await auth.getClient();
  const accessToken = (await client.getAccessToken()).token;

  // This URL needs to be verified against actual Stitch API documentation
  // Assuming a common pattern for Google Cloud APIs:
  // For Stitch, the base URL is likely 'https://stitch.googleapis.com/v1/'
  // and for listing projects, it might be 'projects' or specific to Stitch project resources.
  // The user's example had 'projects/${projectId}/stitchProjects'
  // I will use 'https://stitch.googleapis.com/v1/projects' to list all projects under the authenticated account
  // as the tool `listProjects()` would do.
  const url = `https://stitch.googleapis.com/v1/projects`; 

  if (!accessToken) {
    throw new Error('Failed to obtain access token for StitchClient.');
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}
