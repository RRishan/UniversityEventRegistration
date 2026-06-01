# Event Approval Workflow System

## Overview

The University Event Registration system implements a sophisticated multi-stage approval workflow. Events submitted by organizers must go through a series of approvals by different roles before they can be published and made public.

## Workflow Stages

The approval workflow follows this sequence:

1. **Organization Authority** - Initial approval by organization advisor/authority
2. **Welfare Officer** - General welfare and safety check
3. **Venue Owner** - Venue-specific approval (if applicable)
4. **Category Check** - Category-specific role approval (if applicable)
5. **Security Upload** - President uploads security documentation
6. **Proctor** - Proctor final review
7. **Vice Chancellor** - Vice Chancellor approval
8. **Welfare Final** - Final welfare check
9. **Approved** - Event is fully approved and made public

## Key Roles

- **Organization Authority/Advisor**: First reviewer, typically the club/society advisor
- **Welfare Officer**: Ensures event meets welfare and safety standards
- **Venue Owner**: Reviews venue-specific requirements and capacity
- **Category Approver**: Reviews category-specific requirements (varies by event type)
- **President**: Event president, uploads security documentation when required
- **Proctor**: Academic oversight
- **Vice Chancellor**: Senior administrative approval
- **Admin**: System administrators can view all workflows

## Workflow States

### Pending
- Event is awaiting approval from the current role
- Current role is shown in `currentRole`
- Current stage is shown in `currentStage`
- Assigned reviewer is indicated in `currentAssignee`

### Approved
- Event has passed all required stages
- Made public and visible to all users
- `finalApprovedAt` timestamp is recorded

### Returned
- Event was rejected and sent back to president
- President must address feedback and resubmit
- `returnedToPresidentAt` timestamp is recorded
- Made private until resubmitted

### Rejected
- Event was formally rejected
- Similar to returned but may have additional blocking reasons

## API Endpoints

### Get Approval Queue
```
GET /api/workflow/queue
```
Returns all pending workflows assigned to the current user.

### Submit Workflow Decision
```
POST /api/workflow/decision
Body: {
  eventId: string,
  status: "approved" | "rejected",
  comment: string (optional, required if rejecting)
}
```
Submit an approval or rejection decision.

### Submit Security Proof
```
POST /api/workflow/security-upload
Body: {
  eventId: string,
  imageUrl: string
}
```
Upload security documentation during the securityUpload stage.

### Get Event Approval Details
```
GET /api/workflow/event/:eventId
```
Get full event approval details including:
- Event information
- Related records (organization, project, venue, president)
- Workflow status and history
- Current pending role and stage

## Database Models

### WorkFlow Schema

```javascript
{
  event: ObjectId,                          // Reference to Event
  currentStage: String,                     // Current approval stage
  currentRole: String,                      // Role required to approve
  currentAssignee: ObjectId,                // User assigned to this stage
  status: "pending|returned|approved|rejected",
  requiresSecurity: Boolean,                // If security upload required
  securityImageUrl: String,                 // Security document URL
  securitySubmittedAt: Date,                // When security was uploaded
  history: [{                               // Approval history
    stage: String,
    role: String,
    decision: "approved|rejected|submitted|uploaded",
    comment: String,
    actor: ObjectId,                        // User who made decision
    at: Date
  }],
  returnedToPresidentAt: Date,              // When returned to president
  finalApprovedAt: Date,                    // When fully approved
  createdAt: Date,
  updatedAt: Date
}
```

### Event Schema Fields

```javascript
{
  status: "draft|pending|returned|approved|rejected",
  approvalStage: String,                    // Current stage for event record
  approvalRole: String,                     // Current role for event record
  requiresSecurity: Boolean,                // If security upload required
  securityImageUrl: String,
  securityUploadedAt: Date,
  approvedAt: Date,
  rejectedAt: Date
}
```

## Frontend Components

### PendingApprovalStatus
Displays:
- Current workflow status (pending/approved/rejected)
- Role currently waiting for approval
- Complete approval journey with decisions
- Summary statistics

### ApprovalWorkflowTracker
Shows:
- Visual representation of all approval stages
- Current stage highlighted
- Completed stages marked with checkmarks
- Pending stages with pulse animation
- Rejection indicators

### ApprovalStatusCard
Quick summary card showing:
- Overall approval status
- Current reviewer (if pending)
- Approval/rejection dates
- Color-coded status indicator

## Approval Decision Logic

When a reviewer submits a decision:

1. **Approval**:
   - Decision recorded in workflow history
   - System determines next stage based on event type
   - Workflow moves to next stage
   - Next reviewer/role is assigned
   - Current assignee is resolved based on event details

2. **Rejection**:
   - Decision recorded in workflow history
   - Workflow status set to "returned"
   - Event returned to president for modifications
   - Event made private
   - Comment is required (feedback for president)

## Security Upload Stage

When event reaches security upload stage:
- Current stage is set to 'securityUpload'
- Current role is 'president'
- President uploads security documentation
- System records upload timestamp
- Workflow progresses to proctor stage

## Visibility Rules

- **Draft Events**: Visible only to president and admins
- **Pending Events**: Visible only to relevant reviewers
- **Returned Events**: Visible to president and relevant admins
- **Approved Events**: Visible to all registered users (`publicVisible: true`)

## Data Flow

### Event Submission Flow
1. President submits event (status: pending)
2. WorkFlow created with organizationAuthority stage
3. Organization advisor reviews
4. If approved, moves to next stage
5. If rejected, returned to president

### Re-submission After Rejection
1. President modifies event
2. Resubmits event
3. Workflow resets to organizationAuthority
4. Process repeats

## Role Resolution Logic

The system automatically resolves the correct assignee for each stage:

- **organizationAuthority**: Project's organization authority
- **welfareOfficer**: User with welfareOfficer role
- **venueOwner**: Venue's owner user
- **categoryCheck**: Role based on event category
- **securityUpload**: Event president
- **proctor**: User with proctor role
- **viceChancellor**: User with viceChancellor role
- **welfareFinal**: User with welfareOfficer role

## Workflow Completion Criteria

An event is fully approved when:
1. All required stages complete successfully
2. Final stage (welfareFinal) approves
3. Status set to "approved"
4. `publicVisible` set to true
5. `finalApprovedAt` timestamp recorded

## Error Handling

Common validation checks:
- Verify user has correct role for current stage
- Verify workflow exists and is pending
- Verify event exists and hasn't been modified improperly
- Verify security upload requirements are met
- Verify assignee matches current user (if applicable)

## Testing Workflow

### Test Approval Path
1. Create event as student/organizer
2. Switch to advisor role → approve
3. Switch to welfare officer → approve
4. Continue through stages
5. Verify event becomes public

### Test Rejection Path
1. Create event
2. Switch to reviewer role
3. Submit rejection with comment
4. Verify returned to president
5. Verify event is hidden
6. President resubmits
7. Workflow restarts

## Performance Considerations

- Workflows are populated with related event data
- User lookups are minimized by storing role in currentRole
- History is stored inline for quick access
- Index recommendations:
  - `WorkFlow.event` (for finding by event)
  - `WorkFlow.currentRole` and `status` (for queue queries)
  - `Event.status` (for visibility filtering)
