import { sustainabilityReportService } from '../src/services/SustainabilityReportService.js';
import { complianceSentinel } from '../src/services/esg/ComplianceSentinel.js';
import { taskMatrixService } from '../src/services/esg/TaskMatrixService.js';

console.log("SustainabilityReportService loaded:", !!sustainabilityReportService);
console.log("ComplianceSentinel loaded:", !!complianceSentinel);
console.log("TaskMatrixService loaded:", !!taskMatrixService);
