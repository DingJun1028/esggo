'use client';
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

let apolloClient: any | null = null;

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `${getBaseUrl()}/api/graphql`,
    credentials: 'same-origin',
  });

  let link = httpLink as any;

  if (typeof window !== 'undefined') {
    try {
      const wsLink = new GraphQLWsLink(
        createClient({
          url: `${getBaseUrl().replace('http', 'ws')}/api/graphql`,
          retryAttempts: 3,
        })
      );

      link = split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        wsLink,
        httpLink
      );
    } catch {
      link = httpLink;
    }
  }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            auditLogs: { merge: false },
            tasks: { merge: false },
            esgMetrics: { merge: false },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: { errorPolicy: 'all' as any },
      query: { errorPolicy: 'all' as any },
    },
  });
}

export function getApolloClient() {
  if (!apolloClient) apolloClient = createApolloClient();
  return apolloClient;
}

export default getApolloClient;