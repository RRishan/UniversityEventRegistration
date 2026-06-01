# Event Approval Workflow - Frontend User Guide

## Overview

The frontend provides a comprehensive approval dashboard where reviewers can see pending events, review details, and make approval/rejection decisions. Event organizers can track the approval status of their submitted events.

## Key Pages

### Approval Dashboard
**Route**: `/approval-dashboard`

- Shows all pending events requiring approval by current user
- Displays current role and assigned events
- Quick access to detailed approval pages

### Approval Event Detail
**Route**: `/approval-dashboard/event/:eventId`

Main page for reviewing and approving/rejecting an event.

## Components

### PendingApprovalStatus Component

**Location**: `src/components/ui/PendingApprovalStatus.tsx`

Displays comprehensive approval status information:

**Features**:
- Status indicator with animated pulse for pending state
- Current role waiting for approval (highlighted if pending)
- Complete approval timeline showing all role decisions
- Each approval entry shows:
  - Role that approved/rejected
  - Stage name
  - Decision status (approved/rejected/submitted)
  - Actor information (who made the decision)
  - Timestamp
  - Comment or feedback
- Summary statistics (total approvals, rejections)
- Submission date

**Props**:
```typescript
{
  currentStage: string;        // Current approval stage
  currentRole: string;         // Role waiting for approval
  workflowStatus: string;      // "pending" | "approved" | "returned" | "rejected"
  history: WorkflowHistory[];  // Array of approval decisions
  createdAt?: string | null;   // Event submission date
}
```

**Visual Indicators**:
- 🟢 Approved: Green checkmark
- ❌ Rejected: Red X
- ⏳ Pending: Amber clock with pulse
- 📤 Submitted: Blue alert icon

### ApprovalWorkflowTracker Component

**Location**: `src/components/ui/ApprovalWorkflowTracker.tsx`

Shows visual workflow progression through approval stages.

**Features**:
- Visual timeline of all approval stages
- Color-coded stage status
- Shows completed, pending, and upcoming stages
- Displays decision and approver for completed stages
- Arrows between stages showing flow
- Special states for fully approved or rejected events

**Props**:
```typescript
{
  currentStage: string;        // Current stage
  workflowStatus: string;      // Overall workflow status
  history: WorkflowHistory[];  // Approval history
}
```

**Stage Display**:
- ✓ Completed: Green background, checkmark
- ⏳ Pending: Amber background, animated icon
- ○ Upcoming: Gray background, empty circle
- ✗ Rejected: Red background, X mark

### ApprovalStatusCard Component

**Location**: `src/components/ui/ApprovalStatusCard.tsx`

Compact status summary for sidebars and dashboards.

**Features**:
- Quick status overview
- Color-coded by approval status
- Shows current reviewer (if pending)
- Displays relevant dates
- Ideal for sidebar display

**Props**:
```typescript
{
  status: string;              // Workflow status
  currentRole: string;         // Current role
  currentStage: string;        // Current stage
  finalApprovedAt?: string | null;
  returnedToPresidentAt?: string | null;
}
```

## Approval Event Detail Page Layout

### Top Section
- Back button
- Event cover image with gradient overlay
- Event status badge
- Event title and description

### Main Content Area

#### Event Overview Card
- Event title
- Event date and time
- Venue information
- Expected attendees

#### Pending Approval Status Card
- Shows current approval status
- Highlights which role is waiting
- Full approval journey timeline

#### Approval Progress Tracker
- Visual representation of workflow stages
- Shows completed, pending, and upcoming stages
- Indicates who approved each stage

#### Workflow Timeline Card
- Historical record of all approvals/rejections
- Each entry shows:
  - Stage and role
  - Decision (approved/rejected)
  - Actor (who made decision)
  - Timestamp
  - Comment/feedback

#### Workflow Action Card (if pending)
- Comment textarea for feedback
- Approve button
- Reject button (requires comment)
- Only enabled if current user is the assigned reviewer

### Sidebar

#### Approval Status Card
- Quick status indicator
- Current reviewer (if pending)
- Relevant dates

#### Related Records Card
- Organization details
- Project information
- Venue details
- Event president

#### Approval Summary Card
- Event category
- Current approval stage and role
- Security requirements
- Public visibility
- Link to security attachment (if available)

## User Experience Flows

### For Reviewers

1. **View Pending Events**:
   - Navigate to `/approval-dashboard`
   - See all events waiting for their approval
   - Review assigned event count

2. **Review Event Details**:
   - Click on event to open detail page
   - Review all information
   - Check previous approvals/rejections
   - Read feedback from previous reviewers

3. **Make Approval Decision**:
   - Read the approval notes area
   - Leave feedback (required if rejecting)
   - Click Approve or Reject
   - Return to dashboard
   - Workflow updates automatically

### For Event Organizers

1. **Submit Event**:
   - Fill event form
   - Submit for approval
   - Event enters pending state

2. **Track Progress**:
   - View approval status from event detail
   - See which role is currently reviewing
   - Track full approval timeline
   - View feedback if event is returned

3. **Handle Rejection**:
   - Review feedback from rejected stage
   - Edit event details
   - Resubmit for approval
   - Workflow restarts

## API Integration

### Fetching Event Details
```typescript
// In ApprovalEventDetail.tsx
const { data } = await axios.get(
  `${backendUrl}/api/workflow/event/${eventId}`,
  { withCredentials: true }
);
```

**Response Structure**:
```typescript
{
  success: boolean;
  message: {
    event: EventData;
    relations: RelatedRecords;
    workflow: WorkflowStatus;
  }
}
```

### Submitting Approval Decision
```typescript
const { data } = await axios.post(
  `${backendUrl}/api/workflow/decision`,
  {
    eventId,
    status: "approved" | "rejected",
    comment: "Optional feedback"
  },
  { withCredentials: true }
);
```

## Status Badges

All status indicators use consistent color scheme:

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Pending | Amber | ⏳ | Awaiting approval |
| Approved | Green | ✓ | Successfully approved |
| Returned | Orange | ↩ | Returned for changes |
| Rejected | Red | ✗ | Formally rejected |

## Data Display Formatting

### Dates and Times
- Dates: `formatDate()` - "Jan 15, 2024"
- Times: `formatTime()` - "2:30 PM"

### Role Names
- Use `formatRole()` for consistent capitalization
- Example: `organizationAuthority` → "Organization Authority"

### Comments
- Displayed in gray background boxes
- Italicized for distinction
- Shows quote format: "User comment here"

## Responsive Design

### Desktop (lg+)
- 3-column layout
- Main content (2 cols) + Sidebar (1 col)
- Full workflow tracker visible

### Tablet (md)
- 2-column layout
- Sidebar moves to bottom
- Cards stack appropriately

### Mobile
- Single column
- All cards stack vertically
- Workflow tracker becomes more compact

## Accessibility

- Color-blind friendly status indicators (use icons + text)
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly labels
- ARIA labels on interactive elements

## Performance Considerations

- Components memoized with `useMemo` for role names
- Conditional rendering prevents unnecessary DOM nodes
- Avatar images lazy loaded where applicable
- Minimal re-renders on state changes

## Common Issues and Solutions

### Event Detail Not Loading
- Check network connection
- Verify event ID in URL
- Check user has permission to view

### Approve Button Disabled
- Verify current user is the assigned reviewer
- Check workflow status is "pending"
- Ensure you have the required role

### Reject Requires Comment
- Always provide feedback when rejecting
- Comment helps event organizer understand issues
- Leave specific, actionable feedback

## Future Enhancements

- Email notifications for role changes
- Bulk approval actions for admin
- Approval timeline graphs
- Comment templates for common rejections
- Approval SLA tracking (time per stage)
