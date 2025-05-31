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
