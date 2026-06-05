---
uuid: "4840f1b4-dbee-4c8c-8f2d-fe4888e29e43"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.408Z"
evidence: "docs\RLS_POLICY.md"
---
# RLS Policy Document for ESGGO System

## Overview

This document outlines the Row Level Security (RLS) policies for critical tables within the ESGGO system's database (Supabase/PostgreSQL). RLS is a crucial security measure to ensure data isolation, confidentiality, and integrity, aligning with the OmniCore Constitution's "安全隔離 (Security Isolation)" directive and the "信 (Trust)" principle of the 5T Protocol.

RLS policies ensure that users can only access or modify data rows that they are authorized to interact with, based on their authenticated identity and roles.

## Core Principles for RLS in ESGGO

1.  **Least Privilege:** Users and roles should only have access to the minimum data necessary to perform their functions.
2.  **Explicit Authorization:** Access is granted explicitly, never implicitly. If a policy is not defined, access is denied by default.
3.  **Role-Based Access Control (RBAC):** Policies are primarily defined based on authenticated user roles (e.g., `admin`, `user`, `auditor`).
4.  **Data Ownership:** Users should generally only be able to view and manage data that they own or are explicitly granted access to.
5.  **Auditability:** RLS policies contribute to auditability by ensuring data access is always restricted and logged appropriately.

## RLS Policies for Key Tables (Conceptual)

Below are conceptual RLS policies for `users` (mapping to `SharedUser` entity) and `esg_reports` (mapping to `SharedESGReport` entity) tables, reflecting the `OmniCoreDataEntity` and `NCBDBProtocolEntity` attributes.

---

### Table: `users` (mapping to `SharedUser` entity)

**Context:**
The `users` table stores user profiles. RLS should ensure:
*   Users can only view/update their own profile.
*   `admin` users can view/update all user profiles.
*   `auditor` users can view all user profiles but cannot modify them.

**Assumptions:**
*   A `users` table exists with a `uuid` column and a `role` column (e.g., 'admin', 'user', 'auditor').
*   PostgreSQL `auth.uid()` function returns the `uuid` of the currently authenticated user.
*   PostgreSQL `auth.jwt()` function can be used to extract roles from the JWT.

**RLS Policies (SQL Examples for Supabase/PostgreSQL):**

```sql
-- Enable RLS for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for 'admin' role: Admins can manage all users
CREATE POLICY "Admins can manage all users" ON public.users
FOR ALL USING (
    (auth.jwt() ->> 'user_role')::text = 'admin'
) WITH CHECK (
    (auth.jwt() ->> 'user_role')::text = 'admin'
);

-- Policy for 'user' role: Users can view and update their own profile
CREATE POLICY "Users can view and update their own profile" ON public.users
FOR ALL USING (
    auth.uid() = uuid
) WITH CHECK (
    auth.uid() = uuid
);

-- Policy for 'auditor' role: Auditors can view all users
CREATE POLICY "Auditors can view all users" ON public.users
FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::text = 'auditor'
);

-- Ensure no bypass for authenticated users who don't match other policies (deny by default)
-- This policy is often implicit or handled by the order of policy evaluation
-- However, explicit DENY can be added if needed, but often not necessary if all ALLOW policies are specific.
-- For a secure default, ensure no "FOR SELECT" or "FOR ALL" policies grant broader access unintentionally.
```

---

### Table: `esg_reports` (mapping to `SharedESGReport` entity)

**Context:**
The `esg_reports` table stores ESG reports. RLS should ensure:
*   Users can only view/update/delete reports they are the `user_email` associated with.
*   `admin` users can view/update/delete all reports.
*   `auditor` users can view all reports but cannot modify/delete them.

**Assumptions:**
*   An `esg_reports` table exists with `uuid` (unique report identifier), `user_email` (creator/owner), `integrity_hash`, `version`, `createdAt`, `updatedAt` columns.
*   PostgreSQL `auth.email()` function returns the email of the currently authenticated user.

**RLS Policies (SQL Examples for Supabase/PostgreSQL):**

```sql
-- Enable RLS for the esg_reports table
ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;

-- Policy for 'admin' role: Admins can manage all ESG reports
CREATE POLICY "Admins can manage all ESG reports" ON public.esg_reports
FOR ALL USING (
    (auth.jwt() ->> 'user_role')::text = 'admin'
) WITH CHECK (
    (auth.jwt() ->> 'user_role')::text = 'admin'
);

-- Policy for 'user' role: Users can manage their own reports
CREATE POLICY "Users can manage their own ESG reports" ON public.esg_reports
FOR ALL USING (
    auth.email() = user_email
) WITH CHECK (
    auth.email() = user_email
);

-- Policy for 'auditor' role: Auditors can view all reports
CREATE POLICY "Auditors can view all ESG reports" ON public.esg_reports
FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::text = 'auditor'
);
```

---

## Integration with `ncbClient` (Server-Side Data Access)

The server-side `ncbClient` (located at `@/lib/ncbdb`) plays a critical role in correctly applying RLS.

*   **Authenticated Context:** `ncbClient` MUST ensure that all database requests are made with an authenticated user context (i.e., with a valid JWT containing `auth.uid()`, `auth.email()`, and `user_role`). Without this, RLS policies will likely default to denying access, or behave unexpectedly.
*   **Impersonation (for Admins/System Tasks):** In cases where an `admin` user or an automated system process (e.g., OmniAgent's auto-repair) needs to bypass RLS (e.g., by running queries with `SET ROLE postgres;` or `SECURITY INVOKER OFF`), but this must be used with extreme caution and logged meticulously.
*   **Error Handling:** `ncbClient` should gracefully handle RLS-related errors (e.g., permission denied) and translate them into appropriate application-level errors.

## Further Considerations

*   **Policy Granularity:** Policies can be made more granular (e.g., based on team IDs, project IDs, or specific data states).
*   **Testing RLS:** Thorough unit and integration testing of RLS policies is essential to prevent security vulnerabilities.
*   **Policy Management:** As the system grows, tools for managing and auditing RLS policies will become important.
```