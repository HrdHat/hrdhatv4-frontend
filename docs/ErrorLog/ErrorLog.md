# HrdHat Error Log

**Last Updated**: December 20, 2024

---

## Issue #1: localStorage Size Limitations for Photo Storage

**Date Found**: December 20, 2024
**Severity**: Critical
**Component**: Photo storage strategy
**Description**: Original plan attempted to store 5 photos × 5 forms (100MB+) in localStorage which has only 5-10MB capacity. Math shows 102.75MB needed vs 10MB available = impossible.

**Proposed Solutions**:

1. Use Cache API for temporary photo storage (50-250MB capacity)
2. Use Supabase Storage for permanent photo backup
3. Store only photo metadata (URLs, captions) in localStorage

**Status**: Resolved - Implemented hybrid storage strategy

---

## Issue #2: Poor UX in Original Conflict Resolution Strategy

**Date Found**: December 20, 2024  
**Severity**: High
**Component**: Offline sync conflict resolution
**Description**: Original strategy of "Show both signatures, let user choose" creates terrible UX for construction workers, forcing technical decisions and interrupting workflow.

**Proposed Solutions**:

1. Implement smart automatic resolution (timestamp-priority-with-backup)
2. Use conservative merge for risk assessments (higher risk wins)
3. Only require manual intervention for truly ambiguous cases (same person signs twice within 30 seconds)

**Status**: Resolved - Implemented construction worker-friendly automatic resolution

---

## Issue #3: Missing Chapter Structure for HrdhatConstructionDocs

**Date Found**: December 2024
**Severity**: Medium
**Component**: Documentation organization
**Description**: User noted that data-flow-architecture.md and state-management-architecture.md were not included in the HrdhatConstructionDocs structure, causing confusion about where these foundational documents should live.

**Proposed Solutions**:

1. Keep architecture docs in form-plan/ as planning documents
2. Reference architecture docs from construction chapters where relevant
3. Maintain clear separation between planning docs and implementation guides

**Status**: Resolved - Architecture docs properly categorized as planning documents, not construction guides

---

## Issue #4: Documentation Hierarchy Confusion

**Date Found**: December 2024
**Severity**: Low
**Component**: Documentation structure
**Description**: Initial confusion about whether form planning documents should be moved to construction documentation folder.

**Proposed Solutions**:

1. Clarify distinction between planning docs (form-plan/) and implementation docs (HrdhatConstructionDocs/)
2. Add cross-references from construction chapters to relevant planning docs
3. Document the relationship between planning and implementation docs

**Status**: Resolved - Clear categorization established

---

## Issue #5: Incomplete Backend Enforcement of Email Verification

**Date Found**: June 10, 2024  
**Severity**: High  
**Component**: Authentication & Security  
**Description**: Email verification is currently enforced only in the frontend router. This leaves a security gap, as unverified users could potentially bypass frontend checks and access protected resources via direct API calls or other means.

**Proposed Solutions**:

1. Implement Row Level Security (RLS) policies in Supabase to restrict data access for unverified users.
2. Create an Edge Function to validate email verification status on sensitive backend operations.
3. Add backend-side checks to all protected endpoints, returning 403 for unverified users.

**Status**: Unresolved - Frontend enforcement in place, backend enforcement pending. Resend verification email feature also pending.
