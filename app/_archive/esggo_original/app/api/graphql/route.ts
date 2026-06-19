import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@/lib/graphql/resolvers';
import { NextRequest } from 'next/server';

let schema: any;

function getSchema() {
  if (schema) return schema;
  try {
    const typeDefs = readFileSync(join(process.cwd(), 'lib/graphql/schema.graphql'), 'utf-8');
    schema = makeExecutableSchema({ typeDefs, resolvers });
  } catch {
    const fallbackTypeDefs = `
      type Query { health: String! }
      type Mutation { ping: String! }
    `;
    const fallbackResolvers = {
      Query: { health: () => 'ESG GO GraphQL API is running' },
      Mutation: { ping: () => 'pong' },
    };
    schema = makeExecutableSchema({ typeDefs: fallbackTypeDefs, resolvers: fallbackResolvers });
  }
  return schema;
}

const yoga = createYoga({
  schema: getSchema(),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response },
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['POST', 'GET', 'OPTIONS'],
  },
  landingPage: false,
  graphiql: {
    title: 'ESG GO | GraphQL Explorer',
    defaultQuery: `# ESG GO GraphQL API
# Query dashboard stats
query DashboardStats {
  dashboardStats {
    complianceRate
    carbonEmissions
    griCoverage
    auditCount
    taskCount
    evidenceCount
    verifiedCount
    lastUpdated
  }
}

# Query ESG metrics
query ESGMetrics {
  esgMetrics(category: "E") {
    id
    metricName
    metricValue
    unit
    griStandard
    verified
  }
}

# Create a task
mutation CreateTask {
  createTask(input: {
    title: "完成 GRI 305-1 碳盤查"
    priority: "high"
    assignee: "環安衛主任"
    griReference: "GRI 305-1"
    dueDate: "2025-12-31"
  }) {
    id
    title
    status
    hashLock
  }
}`,
  },
});

export async function GET(request: NextRequest) {
  return yoga.handleRequest(request as any, {}) as any;
}

export async function POST(request: NextRequest) {
  return yoga.handleRequest(request as any, {}) as any;
}

export const dynamic = 'force-dynamic';