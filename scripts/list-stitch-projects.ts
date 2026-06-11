// scripts/list-stitch-projects.ts
import { listStitchProjectsREST } from '../lib/stitch-rest-client';

async function listStitchProjects() {
  try {
    const response = await listStitchProjectsREST();
    console.log('Stitch Projects (REST):', response);
  } catch (error) {
    console.error('Error listing Stitch projects (REST):', error);
  }
}

listStitchProjects();
