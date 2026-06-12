# Email Service Integration Guide

## 📧 Email Service Functions

The email service is located at: `backend/utils/emailService.js`

---

## 🔧 Quick Integration Examples

### 1. Import the Service

```javascript
const { 
  sendApprovalRequestEmail, 
  sendRejectionEmail, 
  sendFinalApprovalEmail 
} = require('../utils/emailService');
```

---

## 📝 Usage Examples

### Example 1: Send Approval Request to Next Reviewer

```javascript
// When approving an event to next stage
const nextReviewer = await User.findById(nextReviewerId);
const baseUrl = `${req.protocol}://${req.get('host')}`;

if (nextReviewer && nextReviewer.email) {
  const result = await sendApprovalRequestEmail(
    nextReviewer.email,
    nextReviewer.fullName,
    event.title,
    {
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      venueName: event.venueName,
      expectedAttendees: event.expectedAttendees,
      currentStage: nextStage  // e.g., 'welfareOfficer'
    },
    `${baseUrl}/approval-dashboard/event/${event._id}`
  );

  if (result.success) {
    console.log('Email sent to', nextReviewer.fullName);
  } else {
    console.log('Failed to send email:', result.error);
  }
}
```

---

### Example 2: Send Rejection Email to President

```javascript
// When rejecting an event
const president = await User.findById(event.president);
const baseUrl = `${req.protocol}://${req.get('host')}`;

if (president && president.email) {
  const result = await sendRejectionEmail(
    president.email,
    president.fullName,
    event.title,
    {
      eventDate: event.eventDate,
      venueName: event.venueName
    },
    'Please provide more details about security measures and staff deployment.',
    `${baseUrl}/events/${event._id}/edit`
  );

  if (result.success) {
    console.log('Rejection email sent to president');
  }
}
```

---

### Example 3: Send Final Approval Email

```javascript
// When event passes all approval stages
const president = await User.findById(event.president);
const baseUrl = `${req.protocol}://${req.get('host')}`;

if (president && president.email) {
  const result = await sendFinalApprovalEmail(
    president.email,
    president.fullName,
    event.title,
    {
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      venueName: event.venueName,
      expectedAttendees: event.expectedAttendees
    },
    `${baseUrl}/events/${event._id}`
  );

  if (result.success) {
    console.log('Final approval email sent');
  }
}
```

---

## 🏗️ Complete Integration in workFlowController.js

Here's how to integrate emails into the `updateWorkflowStatus()` function:

```javascript
const { 
  sendApprovalRequestEmail, 
  sendRejectionEmail, 
  sendFinalApprovalEmail 
} = require('../utils/emailService');

const updateWorkflowStatus = async (req, res) => {
  try {
    const { eventId, status, comment = '' } = req.body;
    const user = await User.findById(req.body.userId);
    const event = await Event.findById(eventId);
    const workflow = await WorkFlow.findOne({ event: event._id });

    // ... existing validation code ...

    workflow.history.push({
      stage: workflow.currentStage,
      role: workflow.currentRole,
      decision: status,
      comment,
      actor: user._id,
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // REJECTION - Send email to president with feedback
    if (status === 'rejected') {
      workflow.status = 'returned';
      workflow.currentStage = 'returnedToPresident';
      event.status = 'returned';
      event.publicVisible = false;

      await event.save();
      await workflow.save();

      // Send rejection email
      const president = await User.findById(event.president);
      if (president && president.email) {
        await sendRejectionEmail(
          president.email,
          president.fullName,
          event.title,
          {
            eventDate: event.eventDate,
            venueName: event.venueName
          },
          comment,
          `${baseUrl}/events/${event._id}/edit`
        ).catch(err => console.error('Email send error:', err));
      }

      return res.send({ success: true, message: workflow });
    }

    // APPROVAL - Move to next stage
    const next = await getNextStage(event, workflow);
    const nextRole = await roleForStage(event, next.stage);
    const nextAssignee = await resolveCurrentAssignee(event, workflow, next.stage);

    workflow.currentStage = next.stage;
    workflow.currentRole = nextRole || workflow.currentRole;
    workflow.currentAssignee = nextAssignee;

    // FINAL APPROVAL - Send success email to president
    if (next.stage === 'approved') {
      workflow.status = 'approved';
      event.status = 'approved';
      event.publicVisible = true;

      await event.save();

      const president = await User.findById(event.president);
      if (president && president.email) {
        await sendFinalApprovalEmail(
          president.email,
          president.fullName,
          event.title,
          {
            eventDate: event.eventDate,
            startTime: event.startTime,
            endTime: event.endTime,
            venueName: event.venueName,
            expectedAttendees: event.expectedAttendees
          },
          `${baseUrl}/events/${event._id}`
        ).catch(err => console.error('Email send error:', err));
      }
    } 
    // NEXT STAGE - Send approval request to next reviewer
    else if (nextAssignee) {
      const nextReviewer = await User.findById(nextAssignee);
      if (nextReviewer && nextReviewer.email) {
        await sendApprovalRequestEmail(
          nextReviewer.email,
          nextReviewer.fullName,
          event.title,
          {
            eventDate: event.eventDate,
            startTime: event.startTime,
            endTime: event.endTime,
            venueName: event.venueName,
            expectedAttendees: event.expectedAttendees,
            currentStage: next.stage
          },
          `${baseUrl}/approval-dashboard/event/${event._id}`
        ).catch(err => console.error('Email send error:', err));
      }
    }

    await event.save();
    await workflow.save();

    return res.send({ success: true, message: workflow });
  } catch (error) {
    return res.send({ success: false, message: `Error: ${error.message}` });
  }
};
```

---

## 🌐 Integration in eventController.js

Here's how to send an email when an event is first created:

```javascript
const { sendApprovalRequestEmail } = require('../utils/emailService');

const createEvent = async (req, res) => {
  try {
    // ... existing event creation code ...

    const savedEvent = await event.save();
    const workflow = await createWorkflow({ 
      event: savedEvent, 
      initialRole, 
      requiresSecurity 
    });

    // SEND INITIAL APPROVAL REQUEST EMAIL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const firstReviewer = await User.findById(
      project.organizationAuthority || project.organization?.advisor?._id
    );

    if (firstReviewer && firstReviewer.email) {
      await sendApprovalRequestEmail(
        firstReviewer.email,
        firstReviewer.fullName,
        savedEvent.title,
        {
          eventDate: savedEvent.eventDate,
          startTime: savedEvent.startTime,
          endTime: savedEvent.endTime,
          venueName: savedEvent.venueName,
          expectedAttendees: savedEvent.expectedAttendees,
          currentStage: initialRole
        },
        `${baseUrl}/approval-dashboard/event/${savedEvent._id}`
      ).catch(err => console.error('Email send error:', err));
    }

    return res.send({
      success: true,
      message: {
        event: savedEvent,
        workflow,
      },
    });
  } catch (error) {
    return res.send({ success: false, message: `Error: ${error.message}` });
  }
};
```

---

## ⚙️ Email Service Functions Reference

### sendApprovalRequestEmail(reviewerEmail, reviewerName, eventTitle, eventDetails, reviewLink)

**Parameters:**
- `reviewerEmail` (string): Email address of the reviewer
- `reviewerName` (string): Full name of the reviewer
- `eventTitle` (string): Title of the event
- `eventDetails` (object): Event details with properties:
  - `eventDate` (string): "2024-12-25"
  - `startTime` (string): "10:00 AM"
  - `endTime` (string): "4:00 PM"
  - `venueName` (string): "Main Auditorium"
  - `expectedAttendees` (number): 500
  - `currentStage` (string): "welfareOfficer"
- `reviewLink` (string): URL to approval dashboard

**Returns:** `Promise<{ success: boolean, messageId?: string, error?: string }>`

**Example:**
```javascript
const result = await sendApprovalRequestEmail(
  'reviewer@gmail.com',
  'John Doe',
  'Tech Conference 2024',
  {
    eventDate: '2024-12-25',
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    venueName: 'Main Auditorium',
    expectedAttendees: 500,
    currentStage: 'welfareOfficer'
  },
  'http://localhost:5000/approval-dashboard/event/123'
);
```

---

### sendRejectionEmail(presidentEmail, presidentName, eventTitle, eventDetails, rejectionComment, editLink)

**Parameters:**
- `presidentEmail` (string): Email of event president
- `presidentName` (string): Full name of president
- `eventTitle` (string): Title of the event
- `eventDetails` (object): Event details with properties:
  - `eventDate` (string): "2024-12-25"
  - `venueName` (string): "Main Auditorium"
- `rejectionComment` (string): Reviewer's feedback
- `editLink` (string): URL to edit event

**Returns:** `Promise<{ success: boolean, messageId?: string, error?: string }>`

**Example:**
```javascript
const result = await sendRejectionEmail(
  'president@gmail.com',
  'Jane Smith',
  'Tech Conference 2024',
  {
    eventDate: '2024-12-25',
    venueName: 'Main Auditorium'
  },
  'Please provide more security details.',
  'http://localhost:5000/events/123/edit'
);
```

---

### sendFinalApprovalEmail(presidentEmail, presidentName, eventTitle, eventDetails, eventLink)

**Parameters:**
- `presidentEmail` (string): Email of event president
- `presidentName` (string): Full name of president
- `eventTitle` (string): Title of the event
- `eventDetails` (object): Event details with properties:
  - `eventDate` (string): "2024-12-25"
  - `startTime` (string): "10:00 AM"
  - `endTime` (string): "4:00 PM"
  - `venueName` (string): "Main Auditorium"
  - `expectedAttendees` (number): 500
- `eventLink` (string): URL to view event

**Returns:** `Promise<{ success: boolean, messageId?: string, error?: string }>`

**Example:**
```javascript
const result = await sendFinalApprovalEmail(
  'president@gmail.com',
  'Jane Smith',
  'Tech Conference 2024',
  {
    eventDate: '2024-12-25',
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    venueName: 'Main Auditorium',
    expectedAttendees: 500
  },
  'http://localhost:5000/events/123'
);
```

---

## 📋 Error Handling

All email functions handle errors gracefully. Use `.catch()` to prevent email errors from blocking the workflow:

```javascript
// Email sending won't block the response
await sendApprovalRequestEmail(...).catch(err => {
  console.error('Email send failed:', err);
  // Workflow continues even if email fails
});

// Or use try-catch
try {
  await sendApprovalRequestEmail(...);
} catch (error) {
  console.error('Email send error:', error);
  // Workflow continues
}
```

---

## ✅ Testing Integration

After integrating emails into your controllers:

1. Create a test event:
   ```bash
   POST /api/event/createEvent
   ```
   → Should trigger approval request email to first reviewer

2. Approve the event:
   ```bash
   POST /api/workflow/updateWorkflowStatus
   { status: "approved" }
   ```
   → Should trigger approval request email to next reviewer

3. Reject an event:
   ```bash
   POST /api/workflow/updateWorkflowStatus
   { status: "rejected", comment: "..." }
   ```
   → Should trigger rejection email to president

4. Complete all stages:
   → Should trigger final approval email to president

---

## 🐛 Debugging

To see email logs in console:

```bash
npm run dev

# Look for these log messages:
# ✓ Approval request email sent: <message-id>
# ✓ Final approval email sent: <message-id>
# ✓ Rejection email sent: <message-id>
# ✗ Error sending email: <error-message>
```

---

## 📚 Related Files

- **Email Service:** `backend/utils/emailService.js`
- **Test Suite:** `backend/tests/email/sendEmailTest.js`
- **Setup Guide:** `SMTP_EMAIL_SETUP_GUIDE.md`
- **Configuration:** `backend/.env`

---

**Status:** Ready to Integrate  
**Version:** 1.0  
**Created:** June 2, 2026
