// Email notifications stubbed — Clerk handles auth emails
// Configure a transactional email service here for event notifications

export async function sendEventNotification(
  _email: string,
  _name: string,
  _eventTitle: string,
  _type: 'registered' | 'reminder' | 'cancelled'
) {
  // TODO: implement with Resend / Postmark / etc.
}
