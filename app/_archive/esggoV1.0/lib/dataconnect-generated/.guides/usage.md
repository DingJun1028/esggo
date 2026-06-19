# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listUserEvidence, listDashboardMetrics, listOcrReviewItems, getCurrentUser, createEvidence, createDashboardMetric, updateOcrReviewItem, upsertUser } from '@esggo/dataconnect';


// Operation ListUserEvidence: 
const { data } = await ListUserEvidence(dataConnect);

// Operation ListDashboardMetrics: 
const { data } = await ListDashboardMetrics(dataConnect);

// Operation ListOcrReviewItems: 
const { data } = await ListOcrReviewItems(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation CreateEvidence:  For variables, look at type CreateEvidenceVars in ../index.d.ts
const { data } = await CreateEvidence(dataConnect, createEvidenceVars);

// Operation CreateDashboardMetric:  For variables, look at type CreateDashboardMetricVars in ../index.d.ts
const { data } = await CreateDashboardMetric(dataConnect, createDashboardMetricVars);

// Operation UpdateOcrReviewItem:  For variables, look at type UpdateOcrReviewItemVars in ../index.d.ts
const { data } = await UpdateOcrReviewItem(dataConnect, updateOcrReviewItemVars);

// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);


```