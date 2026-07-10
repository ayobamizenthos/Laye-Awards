import { Resend } from 'resend'
import { siteConfig } from '@/config/site'

const FROM_NOTIFICATIONS = process.env.RESEND_FROM ?? 'LAYEAWARDS <notifications@layeaward.com>'
const FROM_NOMINATIONS = 'LAYEAWARDS Nominations <nominations@layeaward.com>'
const REPLY_TO = 'enquiries@layeaward.com'

interface BaseArgs {
  to: string
  applicantName: string
  categoryName: string
}

interface ApprovedArgs extends BaseArgs {
  votingUrl: string
  ballotUrl?: string
}

interface RejectedArgs extends BaseArgs {
  note?: string | null
}

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const shell = (heading: string, body: string, footerCta?: string) => `
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#141110;color:#f4efe3;font-family:'DM Sans',-apple-system,system-ui,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141110;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1c1813;border:1px solid #3a3327;border-radius:18px;padding:40px;">
          <tr><td align="center" style="padding-bottom:28px;border-bottom:1px solid #3a3327;">
            <p style="margin:0;font-size:26px;letter-spacing:0.16em;text-transform:uppercase;color:#f4efe3;font-weight:700;font-family:'Cormorant Garamond',Georgia,serif;">Laye<span style="color:#cba94e;">awards</span></p>
          </td></tr>
          <tr><td style="padding-top:28px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#cba94e;">${siteConfig.name} · ${siteConfig.edition.eyebrow}</p>
            <h1 style="margin:18px 0 0;font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:500;line-height:1.15;color:#f4efe3;">${heading}</h1>
            <div style="margin-top:24px;font-size:15px;line-height:1.7;color:#aea48d;">${body}</div>
            ${footerCta ?? ''}
            <p style="margin:32px 0 0;font-size:12px;color:#79705b;">The LAYEAWARDS team</p>
          </td></tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#79705b;">www.${siteConfig.domain} · ${siteConfig.contact.email}</p>
      </td></tr>
    </table>
  </body>
</html>`

export async function sendNomineeLiveEmail(args: ApprovedArgs) {
  const client = getClient()
  if (!client) return
  const body = `<p>Hi ${args.applicantName.split(' ')[0]},</p>
<p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#f4efe3;font-style:italic;">Congratulations, you're live.</p>
<p>Your entry in <strong style="color:#f4efe3;">${args.categoryName}</strong> is now published on the public voting page. Voting is open, and people can back you right away.</p>
<p>Share your personal voting link everywhere: WhatsApp, Instagram, your status, your group chats. Every vote counts toward the win:</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-family:monospace;font-size:13px;color:#cba94e;word-break:break-all;">${args.votingUrl}</p>
${
  args.ballotUrl
    ? `<p>You can also see your card on the live ballot here: <a href="${args.ballotUrl}" style="color:#cba94e;">your spot on the public grid</a>.</p>`
    : ''
}
<p>Open your dashboard any time for your live vote counter and one-tap share buttons.</p>`
  await client.emails.send({
    from: FROM_NOMINATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `You're live on ${siteConfig.name}, start sharing your voting link`,
    html: shell(
      "You're live. Start sharing.",
      body,
      `
<p style="margin:28px 0 0;"><a href="${args.votingUrl}" style="display:inline-block;padding:14px 26px;background:#cba94e;color:#141110;border-radius:999px;font-weight:600;text-decoration:none;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">View your profile</a></p>`
    ),
  })
}

export async function sendApplicationRejectedEmail(args: RejectedArgs) {
  const client = getClient()
  if (!client) return
  const noteBlock = args.note
    ? `<p style="margin:18px 0;padding:14px 18px;background:#141110;border-left:2px solid #cba94e;border-radius:6px;font-size:14px;color:#f4efe3;font-style:italic;">${args.note}</p>`
    : ''
  const body = `<p>Hi ${args.applicantName.split(' ')[0]},</p>
<p>Thank you for putting yourself forward for the ${siteConfig.fullName}, ${siteConfig.edition.ordinal} Edition.</p>
<p>After careful review, the panel has not taken your entry for <strong style="color:#f4efe3;">${args.categoryName}</strong> through to the public vote this year.</p>
${noteBlock}
<p>We're rooting for you and hope to see you on the ballot in a future edition.</p>`
  await client.emails.send({
    from: FROM_NOMINATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `Update on your ${siteConfig.name} application`,
    html: shell('A note from the panel.', body),
  })
}

interface BankPendingArgs {
  to: string
  voterName: string
  voteCount: number
  nomineeName: string
  amountNaira: number
  bankReference: string
}

export async function sendBankTransferPendingEmail(args: BankPendingArgs) {
  const client = getClient()
  if (!client) return
  const body = `<p>Hi ${args.voterName.split(' ')[0]},</p>
<p>Thanks for backing <strong style="color:#f4efe3;">${args.nomineeName}</strong> at the ${siteConfig.fullName}.</p>
<p>We've logged your intent to cast <strong style="color:#f4efe3;">${args.voteCount} vote${args.voteCount === 1 ? '' : 's'}</strong> (₦${args.amountNaira.toLocaleString('en-NG')}) via bank transfer.</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-size:14px;">
<strong style="color:#cba94e;">Reference:</strong> <span style="color:#f4efe3;">${args.bankReference}</span><br/>
<strong style="color:#cba94e;">Account:</strong> <span style="color:#f4efe3;">1313008097 · Zenith Bank · LAYEAWARDS ENTERPRISE</span>
</p>
<p>Once our team confirms the transfer, your votes will be added to ${args.nomineeName.split(' ')[0]}'s tally and you'll get a confirmation email.</p>
<p>If you haven't made the transfer yet, please send <strong style="color:#f4efe3;">₦${args.amountNaira.toLocaleString('en-NG')}</strong> to the account above using <strong style="color:#f4efe3;">${args.bankReference}</strong> as the description.</p>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `Your ${siteConfig.name} bank transfer, awaiting confirmation`,
    html: shell('We have your vote pending.', body),
  })
}

interface BankConfirmedArgs {
  to: string
  voterName: string
  voteCount: number
  nomineeName: string
  nomineeUrl: string
}

export async function sendBankTransferConfirmedEmail(args: BankConfirmedArgs) {
  const client = getClient()
  if (!client) return
  const body = `<p>Hi ${args.voterName.split(' ')[0]},</p>
<p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#f4efe3;font-style:italic;">Your vote is in.</p>
<p>Your ${args.voteCount} vote${args.voteCount === 1 ? '' : 's'} for <strong style="color:#f4efe3;">${args.nomineeName}</strong> ${args.voteCount === 1 ? 'has' : 'have'} been confirmed and added to the tally. Thank you for backing them.</p>
<p>Want to cast more? Open their profile any time before voting closes.</p>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `${args.voteCount} vote${args.voteCount === 1 ? '' : 's'} confirmed for ${args.nomineeName}`,
    html: shell(
      'Vote confirmed.',
      body,
      `<p style="margin:28px 0 0;"><a href="${args.nomineeUrl}" style="display:inline-block;padding:14px 26px;background:#cba94e;color:#141110;border-radius:999px;font-weight:600;text-decoration:none;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">View nominee</a></p>`
    ),
  })
}

interface ContactMessageArgs {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactMessageEmail(args: ContactMessageArgs) {
  const client = getClient()
  if (!client) throw new Error('Email service is not configured.')
  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  const body = `<p>A new enquiry just came in from the LAYEAWARDS website.</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-size:14px;">
<strong style="color:#cba94e;">From:</strong> <span style="color:#f4efe3;">${escape(args.name)}</span><br/>
<strong style="color:#cba94e;">Reply to:</strong> <span style="color:#f4efe3;">${escape(args.email)}</span><br/>
<strong style="color:#cba94e;">Subject:</strong> <span style="color:#f4efe3;">${escape(args.subject)}</span>
</p>
<p style="margin:14px 0 6px;color:#cba94e;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;">Message</p>
<p style="white-space:pre-line;">${escape(args.message)}</p>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: siteConfig.contact.email,
    replyTo: args.email,
    subject: `LAYEAWARDS enquiry · ${args.subject}`,
    html: shell('New enquiry.', body),
  })
}

interface NewEntryArgs {
  to: string[]
  applicantName: string
  businessName: string
  categoryName: string
  applicantEmail: string
  whatsappNumber: string
  profileUrl: string
  adminUrl: string
}

export async function sendNewEntryAdminEmail(args: NewEntryArgs) {
  const client = getClient()
  if (!client || !args.to.length) return
  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const body = `<p>A new entry just went live on the public voting page.</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-size:14px;">
<strong style="color:#cba94e;">Name:</strong> <span style="color:#f4efe3;">${escape(args.applicantName)}</span><br/>
<strong style="color:#cba94e;">Business:</strong> <span style="color:#f4efe3;">${escape(args.businessName)}</span><br/>
<strong style="color:#cba94e;">Category:</strong> <span style="color:#f4efe3;">${escape(args.categoryName)}</span><br/>
<strong style="color:#cba94e;">Email:</strong> <span style="color:#f4efe3;">${escape(args.applicantEmail)}</span><br/>
<strong style="color:#cba94e;">WhatsApp:</strong> <span style="color:#f4efe3;">${escape(args.whatsappNumber)}</span>
</p>
<p>Their profile is already published and collecting votes: <a href="${args.profileUrl}" style="color:#cba94e;">view the public card</a>.</p>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `New entry: ${args.businessName} (${args.categoryName})`,
    html: shell(
      'New entry on the ballot.',
      body,
      `
<p style="margin:28px 0 0;"><a href="${args.adminUrl}" style="display:inline-block;padding:14px 26px;background:#cba94e;color:#141110;border-radius:999px;font-weight:600;text-decoration:none;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Open the control room</a></p>`
    ),
  })
}

interface VoteConfirmationArgs {
  to: string
  nomineeName: string
  voteCount: number
  amountKobo: number
  reference: string
  nomineeUrl: string
}

export async function sendVoteConfirmationEmail(args: VoteConfirmationArgs) {
  const client = getClient()
  if (!client) return
  const naira = `₦${(args.amountKobo / 100).toLocaleString('en-NG')}`
  const body = `<p>Your vote is confirmed. Thank you for backing <strong style="color:#f4efe3;">${args.nomineeName}</strong>.</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-size:14px;">
<strong style="color:#cba94e;">Votes cast:</strong> <span style="color:#f4efe3;">${args.voteCount}</span><br/>
<strong style="color:#cba94e;">Amount:</strong> <span style="color:#f4efe3;">${naira}</span><br/>
<strong style="color:#cba94e;">Reference:</strong> <span style="color:#f4efe3;">${args.reference}</span>
</p>
<p>Your ${args.voteCount === 1 ? 'vote has' : 'votes have'} been added to their tally on the public ballot.</p>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `Vote confirmed: ${args.voteCount} for ${args.nomineeName}`,
    html: shell(
      'Your vote is confirmed.',
      body,
      `
<p style="margin:28px 0 0;"><a href="${args.nomineeUrl}" style="display:inline-block;padding:14px 26px;background:#cba94e;color:#141110;border-radius:999px;font-weight:600;text-decoration:none;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">See the tally</a></p>`
    ),
  })
}

interface DailyVoteSummaryArgs {
  to: string[]
  dateLabel: string
  totalVotes: number
  totalNaira: number
  paymentCount: number
  perNominee: { name: string; business: string; votes: number }[]
}

export async function sendDailyVoteSummaryEmail(args: DailyVoteSummaryArgs) {
  const client = getClient()
  if (!client || !args.to.length) return
  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const rows = args.perNominee.length
    ? args.perNominee
        .map(
          nominee => `<tr>
<td style="padding:8px 12px;border-top:1px solid #3a3327;color:#f4efe3;">${escape(nominee.name)}<br/><span style="color:#79705b;font-size:12px;">${escape(nominee.business)}</span></td>
<td style="padding:8px 12px;border-top:1px solid #3a3327;color:#cba94e;text-align:right;font-weight:600;">${nominee.votes}</td>
</tr>`
        )
        .join('')
    : `<tr><td colspan="2" style="padding:12px;color:#79705b;">No votes recorded today.</td></tr>`
  const body = `<p>Here is today's voting summary.</p>
<p style="margin:18px 0;padding:14px 18px;background:#141110;border:1px solid #3a3327;border-radius:10px;font-size:15px;">
<strong style="color:#cba94e;">Total votes:</strong> <span style="color:#f4efe3;">${args.totalVotes}</span><br/>
<strong style="color:#cba94e;">Payments:</strong> <span style="color:#f4efe3;">${args.paymentCount}</span><br/>
<strong style="color:#cba94e;">Amount:</strong> <span style="color:#f4efe3;">₦${args.totalNaira.toLocaleString('en-NG')}</span>
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
<tr><th align="left" style="padding:8px 12px;color:#cba94e;text-transform:uppercase;letter-spacing:0.12em;font-size:11px;">Nominee</th><th align="right" style="padding:8px 12px;color:#cba94e;text-transform:uppercase;letter-spacing:0.12em;font-size:11px;">Votes</th></tr>
${rows}
</table>`
  await client.emails.send({
    from: FROM_NOTIFICATIONS,
    to: args.to,
    replyTo: REPLY_TO,
    subject: `Daily votes · ${args.dateLabel} · ${args.totalVotes} votes (₦${args.totalNaira.toLocaleString('en-NG')})`,
    html: shell(`Votes for ${args.dateLabel}.`, body),
  })
}
