# Fynd — Backend Documentation
### Comprehensive Implementation Guide for Backend Developer

---

## Overview

Fynd is a dual-sided platform combining an AI-vetted job search experience with a blockchain-powered quick gigs marketplace. This document covers every backend capability, integration, and implementation guideline required to build Fynd's server-side infrastructure.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js or Firebase Cloud Functions |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Auth | LazorKit (Solana passkey-based auth) |
| AI — Interviewer & Auto-Applier | Google Gemini API (`GEMINI_FLUFFY_KEY`) |
| AI — Autonomous Agent | Google Gemini API (`GEMINI_SCOUT_KEY`) |
| Blockchain | Solana (Devnet for demo) |
| Payments | Paystack (test mode) + Solana Pay (devnet) |
| Agent Payments | Solana x402 Protocol |
| Email | SendGrid or Nodemailer |
| Code Rendering | GitHub API |
| Design Rendering | Puppeteer (HTML → PNG) |

---

## Environment Variables

```env
# Gemini AI Keys
GEMINI_FLUFFY_KEY=your_fluffy_gemini_key
GEMINI_SCOUT_KEY=your_scout_gemini_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_test_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_test_public_key

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PLATFORM_WALLET_PRIVATE_KEY=your_platform_wallet_key

# GitHub (for Scout code bounties)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_ORG=fynd-submissions

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@fynd.xyz

# LazorKit
LAZORKIT_API_KEY=your_lazorkit_key
```

---

## Firestore Collections — Full Schema

### `users`
```
{
  uid: string,                    // LazorKit user ID
  fullName: string,
  username: string,
  email: string,
  country: string,
  walletAddress: string,          // LazorKit Solana wallet public key
  activeSide: "job_search" | "quick_gigs" | null,
  enrolledSides: array,           // ["job_search", "quick_gigs"]
  scoutTier: "free" | "paid",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `jobseeker_profiles`
```
{
  uid: string,
  skills: array,                  // ["js_dev", "ui_ux_designer"]
  yearsOfExperience: number,
  portfolioLink: string,
  bio: string,
  resumeUrl: string,              // Firebase Storage URL
  resumeText: string,             // Extracted text from resume for AI use
  approvalStatus: "pending" | "approved" | "rejected",
  interviewToken: string,         // Unique single-use interview link token
  interviewTokenExpiry: timestamp,
  interviewCompleted: boolean,
  credits: number,                // Default 200
  creditResetDate: timestamp,     // Monthly reset date
  createdAt: timestamp
}
```

### `company_profiles` (Job Search)
```
{
  uid: string,
  companyName: string,
  companyEmail: string,
  website: string,
  industry: string,
  companySize: string,
  logoUrl: string,
  plan: "per_post" | "3_months" | "6_months" | "1_year" | null,
  planExpiry: timestamp,
  planActive: boolean,
  jobPostsRemaining: number,      // For per_post plan
  createdAt: timestamp
}
```

### `jobs`
```
{
  id: string,
  companyUid: string,
  companyName: string,
  companyLogo: string,
  title: string,
  description: string,
  type: "fulltime" | "parttime" | "contract" | "internship",
  location: string,
  remote: boolean,
  skillsRequired: array,
  salaryRange: { min: number, max: number, currency: string },
  creditCost: number,             // Min 5, varies by job worth
  status: "active" | "closed",
  createdAt: timestamp
}
```

### `applications`
```
{
  id: string,
  jobId: string,
  seekerUid: string,
  companyUid: string,
  coverLetter: string,            // AI generated or user provided
  resumeUrl: string,
  creditsDeducted: number,
  status: "submitted" | "viewed" | "contacted" | "rejected",
  createdAt: timestamp
}
```

### `assessments`
```
{
  id: string,
  seekerUid: string,
  token: string,                  // Unique interview token
  skills: array,                  // Skills being assessed
  transcript: array,              // Full conversation history
  codingQuestion: string,
  codingAnswer: string,
  codingTimeUsed: number,         // Seconds used out of 20
  status: "pending" | "in_progress" | "completed" | "reviewed",
  result: "approved" | "rejected" | null,
  createdAt: timestamp,
  completedAt: timestamp
}
```

### `earner_profiles` (Quick Gigs)
```
{
  uid: string,
  skillCategories: array,         // ["development", "design", "creator"]
  bio: string,
  socialLinks: object,
  skillMdFiles: array,            // Firebase Storage URLs of uploaded skill.md files
  skillMdContent: string,         // Concatenated content of all skill.md files
  totalEarnings: number,
  bountiesApplied: number,
  bountiesWon: number,
  memberSince: timestamp,
  portfolioSlug: string           // username for fynd.xyz/portfolio/username
}
```

### `business_profiles` (Quick Gigs)
```
{
  uid: string,
  companyName: string,
  companyEmail: string,
  socialHandles: object,
  companyWebsite: string,
  documentUrls: array,            // Firebase Storage URLs of uploaded docs
  verificationStatus: "pending" | "verified" | "rejected",
  verificationSubmittedAt: timestamp,
  verifiedAt: timestamp,
  totalBountiesPosted: number,
  totalEscrowDeposited: number
}
```

### `bounties`
```
{
  id: string,
  businessUid: string,
  businessName: string,
  businessLogo: string,
  title: string,
  description: string,
  requirements: string,
  skillCategory: "development" | "design" | "creator",
  rewardAmount: number,
  rewardCurrency: "USDC" | "USD",
  deadline: timestamp,
  maxSubmissions: number,         // Default 35, max 35
  currentSubmissions: number,
  escrowStatus: "pending" | "funded" | "released",
  escrowTxSignature: string,      // Solana transaction signature
  winnerId: string,
  winnerWalletAddress: string,
  payoutTxSignature: string,
  status: "active" | "closed" | "completed",
  paystackReference: string,      // Paystack payment reference
  createdAt: timestamp
}
```

### `submissions`
```
{
  id: string,
  bountyId: string,
  earnerUid: string,
  submissionType: "text" | "link" | "github_repo" | "design_png",
  content: string,                // Text or link
  githubRepoUrl: string,          // For code submissions
  designUrl: string,              // Firebase Storage URL for design PNG
  submittedByScout: boolean,      // true if Scout submitted autonomously
  status: "submitted" | "winner" | "rejected",
  createdAt: timestamp
}
```

### `credits`
```
{
  uid: string,
  balance: number,
  resetDate: timestamp,
  transactions: array [
    {
      type: "monthly_grant" | "purchase" | "deduct",
      amount: number,
      jobId: string,              // For deductions
      paystackReference: string,  // For purchases
      timestamp: timestamp
    }
  ]
}
```

### `scout_conversations`
```
{
  uid: string,
  messages: array [
    {
      role: "user" | "assistant",
      content: string,
      timestamp: timestamp
    }
  ],
  updatedAt: timestamp
}
```

### `notifications`
```
{
  uid: string,
  notifications: array [
    {
      id: string,
      type: string,
      message: string,
      read: boolean,
      link: string,
      createdAt: timestamp
    }
  ]
}
```

---

## Module 1 — Authentication & LazorKit

### How LazorKit Works
LazorKit handles passkey-based authentication and automatically creates a Solana wallet for every user. The frontend handles the LazorKit SDK — your job on the backend is to receive the user data after successful auth and set up the Firestore user document.

### Implementation

**Endpoint: POST `/api/auth/register`**
```javascript
const registerUser = async (req, res) => {
  const { uid, email, fullName, username, country, walletAddress } = req.body
  // walletAddress comes from LazorKit after successful auth

  // Check if username already taken
  const existing = await db.collection('users')
    .where('username', '==', username).get()
  if (!existing.empty) {
    return res.status(400).json({ error: 'Username taken' })
  }

  // Create user document
  await db.collection('users').doc(uid).set({
    uid,
    fullName,
    username,
    email,
    country,
    walletAddress,          // LazorKit Solana wallet — store this
    activeSide: null,
    enrolledSides: [],
    scoutTier: 'free',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  res.status(201).json({ success: true })
}
```

**Critical note:** The `walletAddress` from LazorKit is a fully functional Solana wallet public key. Store it on the user document — it is used for escrow payouts, x402 withdrawals, and Scout transactions throughout the platform.

---

## Module 2 — Fluffy: AI Interviewer & Auto-Applier

Fluffy is Fynd's named AI entity powered by Gemini. It has two responsibilities: conducting the job seeker assessment interview and auto-applying to jobs on behalf of approved seekers.

### Fluffy's Persona (System Prompt)

```javascript
const FLUFFY_SYSTEM_PROMPT = `
You are Fluffy, the AI interviewer for Fynd — a platform 
connecting verified tech talent to top companies and opportunities.

Your personality:
- Warm, encouraging, and professional
- Conversational — you sound like a real human interviewer
- Sharp and evaluative — you are assessing seriously
- You never mention Gemini, Google, or any AI model
- You never say you are an AI
- You ARE Fluffy. That is your only identity
- You work for Fynd and represent the platform proudly

Your job during interviews:
- Ask EXACTLY 3 questions based on the candidate's selected skills
- React naturally to their answers before asking the next question
- Keep your responses concise and conversational
- After exactly 3 questions and answers, wrap up Section 1
- Do NOT ask more than 3 questions under any circumstance

Candidate skills: {{SKILLS}}
`
```

### 2.1 Interview Token Generation

When a seeker completes the enrollment form, generate a unique single-use interview token and send it via email.

```javascript
const generateInterviewToken = async (req, res) => {
  const { uid, skills, yearsOfExperience, portfolioLink, bio } = req.body
  
  // Generate unique token
  const token = crypto.randomUUID()
  const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48hrs

  // Save seeker profile
  await db.collection('jobseeker_profiles').doc(uid).set({
    uid,
    skills,
    yearsOfExperience,
    portfolioLink,
    bio,
    approvalStatus: 'pending',
    interviewToken: token,
    interviewTokenExpiry: expiry,
    interviewCompleted: false,
    credits: 200,
    creditResetDate: getNextMonthDate(),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  // Create assessment document
  await db.collection('assessments').doc(token).set({
    seekerUid: uid,
    token,
    skills,
    transcript: [],
    status: 'pending',
    result: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  // Send email with interview link
  await sendInterviewEmail(uid, token)

  res.json({ success: true, message: 'Interview link sent to email' })
}

const sendInterviewEmail = async (uid, token) => {
  const user = await db.collection('users').doc(uid).get()
  const { email, fullName } = user.data()
  
  await sendgrid.send({
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Your Fynd Interview is Ready',
    html: `
      <h2>Hey ${fullName}!</h2>
      <p>Your Fynd interview is ready. Click below to begin:</p>
      <a href="https://fynd.xyz/interview/${token}">Start My Interview</a>
      <p>This link expires in 48 hours and can only be used once.</p>
      <p>Good luck! — Fluffy 🐾</p>
    `
  })
}
```

### 2.2 Interview Session — Fluffy Conversation

**Endpoint: POST `/api/interview/message`**

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fluffyAI = new GoogleGenerativeAI(process.env.GEMINI_FLUFFY_KEY)

const handleInterviewMessage = async (req, res) => {
  const { token, userMessage } = req.body

  // Validate token
  const assessment = await db.collection('assessments').doc(token).get()
  if (!assessment.exists) return res.status(404).json({ error: 'Invalid token' })
  
  const data = assessment.data()
  if (data.status === 'completed') {
    return res.status(400).json({ error: 'Interview already completed' })
  }

  // Update status to in_progress
  if (data.status === 'pending') {
    await db.collection('assessments').doc(token).update({ 
      status: 'in_progress' 
    })
  }

  // Build conversation history
  const history = data.transcript.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }))

  // Count questions asked so far
  const questionsAsked = data.transcript
    .filter(m => m.role === 'model' && m.content.includes('?')).length

  // Initialize Fluffy
  const model = fluffyAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: FLUFFY_SYSTEM_PROMPT.replace('{{SKILLS}}', data.skills.join(', '))
  })

  const chat = model.startChat({ history })
  
  // If 3 questions done, end section 1
  if (questionsAsked >= 3 && userMessage) {
    const finalResponse = "You've done wonderfully! That wraps up our conversation section. Let's move on to the coding challenge — you've got this! 💪"
    
    // Save to transcript
    await saveToTranscript(token, userMessage, finalResponse)
    
    return res.json({ 
      message: finalResponse, 
      section1Complete: true 
    })
  }

  // Stream Fluffy's response
  const result = await chat.sendMessage(userMessage || 'START_INTERVIEW')
  const fluffyResponse = result.response.text()

  // Save exchange to transcript
  await saveToTranscript(token, userMessage, fluffyResponse)

  res.json({ 
    message: fluffyResponse,
    questionsAsked: questionsAsked + 1,
    section1Complete: false
  })
}

const saveToTranscript = async (token, userMessage, fluffyResponse) => {
  await db.collection('assessments').doc(token).update({
    transcript: admin.firestore.FieldValue.arrayUnion(
      { role: 'user', content: userMessage, timestamp: new Date() },
      { role: 'model', content: fluffyResponse, timestamp: new Date() }
    )
  })
}
```

### 2.3 Coding Test Question Generation

**Endpoint: POST `/api/interview/coding-question`**

```javascript
const generateCodingQuestion = async (req, res) => {
  const { token } = req.body

  const assessment = await db.collection('assessments').doc(token).get()
  const { skills } = assessment.data()

  const model = fluffyAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
    Generate ONE simple coding question for a candidate with these skills: ${skills.join(', ')}
    
    Requirements:
    - Keep it simple enough to read and understand in 20 seconds
    - Include a clear problem statement (2-3 sentences max)
    - Include one input/output example
    - Return ONLY the question, no solution, no explanation
    - Format: Problem statement first, then Example
  `

  const result = await model.generateContent(prompt)
  const question = result.response.text()

  // Save coding question to assessment
  await db.collection('assessments').doc(token).update({ 
    codingQuestion: question 
  })

  res.json({ question })
}
```

### 2.4 Submit Coding Answer & Complete Interview

**Endpoint: POST `/api/interview/submit`**

```javascript
const submitInterview = async (req, res) => {
  const { token, codingAnswer, timeUsed } = req.body

  await db.collection('assessments').doc(token).update({
    codingAnswer,
    codingTimeUsed: timeUsed,
    status: 'completed',
    completedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  // Update seeker profile
  const assessment = await db.collection('assessments').doc(token).get()
  await db.collection('jobseeker_profiles').doc(assessment.data().seekerUid).update({
    interviewCompleted: true
  })

  // Send confirmation email
  await sendCompletionEmail(assessment.data().seekerUid)

  res.json({ 
    success: true, 
    message: 'Interview submitted. Results in 1-2 days.' 
  })
}
```

### 2.5 Fluffy Auto-Applier

Triggered when a seeker swipes right on a job. Fluffy generates a tailored cover letter and optionally a custom resume.

**Endpoint: POST `/api/jobs/apply`**

```javascript
const autoApply = async (req, res) => {
  const { uid, jobId, useOwnResume } = req.body

  // Fetch seeker profile and job details
  const [seekerDoc, jobDoc] = await Promise.all([
    db.collection('jobseeker_profiles').doc(uid).get(),
    db.collection('jobs').doc(jobId).get()
  ])

  const seeker = seekerDoc.data()
  const job = jobDoc.data()
  const user = (await db.collection('users').doc(uid).get()).data()

  // Check credit balance
  if (seeker.credits < job.creditCost) {
    return res.status(400).json({ 
      error: 'Insufficient credits',
      creditsNeeded: job.creditCost,
      creditsAvailable: seeker.credits
    })
  }

  const model = fluffyAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Generate cover letter
  const coverLetterPrompt = `
    You are Fluffy, the AI assistant for Fynd.
    Generate a professional, tailored cover letter for this job application.
    
    Candidate Profile:
    - Name: ${user.fullName}
    - Skills: ${seeker.skills.join(', ')}
    - Experience: ${seeker.yearsOfExperience} years
    - Bio: ${seeker.bio}
    
    Job Details:
    - Title: ${job.title}
    - Company: ${job.companyName}
    - Description: ${job.description}
    - Skills Required: ${job.skillsRequired.join(', ')}
    
    Write a compelling, specific cover letter. 3 paragraphs max.
    Do not use generic phrases. Reference specific job details.
  `

  const coverLetterResult = await model.generateContent(coverLetterPrompt)
  const coverLetter = coverLetterResult.response.text()

  let resumeUrl = seeker.resumeUrl // default to uploaded resume

  // Generate custom resume if user doesn't want their own
  if (!useOwnResume) {
    const resumePrompt = `
      Generate a clean professional resume in HTML format for:
      Name: ${user.fullName}
      Skills: ${seeker.skills.join(', ')}
      Experience: ${seeker.yearsOfExperience} years
      Bio: ${seeker.bio}
      Target Job: ${job.title} at ${job.companyName}
      
      Return only clean HTML. No markdown. No explanation.
    `
    const resumeResult = await model.generateContent(resumePrompt)
    const resumeHtml = resumeResult.response.text()
    
    // Convert HTML to PDF using Puppeteer and store in Firebase Storage
    resumeUrl = await htmlToStorageUrl(resumeHtml, uid, jobId)
  }

  // Create application document
  const applicationRef = await db.collection('applications').add({
    jobId,
    seekerUid: uid,
    companyUid: job.companyUid,
    coverLetter,
    resumeUrl,
    creditsDeducted: job.creditCost,
    status: 'submitted',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  // Deduct credits
  await db.collection('jobseeker_profiles').doc(uid).update({
    credits: admin.firestore.FieldValue.increment(-job.creditCost)
  })

  // Log credit transaction
  await db.collection('credits').doc(uid).update({
    balance: admin.firestore.FieldValue.increment(-job.creditCost),
    transactions: admin.firestore.FieldValue.arrayUnion({
      type: 'deduct',
      amount: job.creditCost,
      jobId,
      timestamp: new Date()
    })
  })

  res.json({ 
    success: true,
    applicationId: applicationRef.id,
    coverLetter,
    resumeUrl
  })
}
```

---

## Module 3 — Credit System

### Monthly Credit Reset
Use a Firebase Cloud Function scheduled to run on the 1st of every month:

```javascript
exports.resetMonthlyCredits = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(async () => {
    const seekers = await db.collection('jobseeker_profiles').get()
    
    const batch = db.batch()
    seekers.forEach(doc => {
      batch.update(doc.ref, {
        credits: 200,
        creditResetDate: getNextMonthDate()
      })
    })
    
    await batch.commit()
    console.log('Monthly credits reset complete')
  })
```

### Credit Purchase via Paystack

**Endpoint: POST `/api/credits/purchase`**
```javascript
const purchaseCredits = async (req, res) => {
  const { uid, paystackReference } = req.body

  // Verify payment with Paystack
  const verification = await axios.get(
    `https://api.paystack.co/transaction/verify/${paystackReference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  )

  if (verification.data.data.status !== 'success') {
    return res.status(400).json({ error: 'Payment verification failed' })
  }

  // Add 200 credits
  await db.collection('jobseeker_profiles').doc(uid).update({
    credits: admin.firestore.FieldValue.increment(200)
  })

  await db.collection('credits').doc(uid).update({
    balance: admin.firestore.FieldValue.increment(200),
    transactions: admin.firestore.FieldValue.arrayUnion({
      type: 'purchase',
      amount: 200,
      paystackReference,
      timestamp: new Date()
    })
  })

  res.json({ success: true, creditsAdded: 200 })
}
```

---

## Module 4 — Job Search Company Plans

### Plan Definitions
```javascript
const PLANS = {
  per_post: { price: 500, jobPosts: 1, durationDays: null },
  '3_months': { price: 4900, jobPosts: -1, durationDays: 90 },   // -1 = unlimited
  '6_months': { price: 8900, jobPosts: -1, durationDays: 180 },
  '1_year': { price: 14900, jobPosts: -1, durationDays: 365 }
}
// Prices in cents/kobo
```

**Endpoint: POST `/api/company/activate-plan`**
```javascript
const activatePlan = async (req, res) => {
  const { uid, plan, paystackReference } = req.body

  // Verify Paystack payment
  const verification = await verifyPaystack(paystackReference)
  if (!verification) return res.status(400).json({ error: 'Payment failed' })

  const planDetails = PLANS[plan]
  const expiry = planDetails.durationDays 
    ? new Date(Date.now() + planDetails.durationDays * 86400000)
    : null

  await db.collection('company_profiles').doc(uid).update({
    plan,
    planExpiry: expiry,
    planActive: true,
    jobPostsRemaining: planDetails.jobPosts
  })

  res.json({ success: true, plan, expiry })
}
```

---

## Module 5 — Quick Gigs: Bounty System

### 5.1 Business Verification

**Endpoint: POST `/api/quick-gigs/business/apply`**
```javascript
const applyForVerification = async (req, res) => {
  const { uid, companyName, companyEmail, socialHandles, 
          companyWebsite, documentUrls } = req.body

  await db.collection('business_profiles').doc(uid).set({
    uid,
    companyName,
    companyEmail,
    socialHandles,
    companyWebsite,
    documentUrls,
    verificationStatus: 'pending',
    verificationSubmittedAt: admin.firestore.FieldValue.serverTimestamp(),
    totalBountiesPosted: 0,
    totalEscrowDeposited: 0
  })

  // Notify admin (send email to your team)
  await notifyAdminOfVerification(uid, companyName)

  res.json({ success: true, message: 'Verification submitted. 48hr review.' })
}
```

### 5.2 Post Bounty & Escrow Deposit

The flow is:
1. Business fills bounty form
2. Paystack payment for reward amount
3. Backend verifies payment
4. Bounty goes live with escrowStatus: "funded"

**Endpoint: POST `/api/bounties/create`**
```javascript
const createBounty = async (req, res) => {
  const { uid, title, description, requirements, skillCategory,
          rewardAmount, deadline, maxSubmissions, paystackReference } = req.body

  // Verify business is verified
  const business = await db.collection('business_profiles').doc(uid).get()
  if (business.data().verificationStatus !== 'verified') {
    return res.status(403).json({ error: 'Business not verified' })
  }

  // Verify Paystack escrow payment
  const verification = await verifyPaystack(paystackReference)
  if (!verification) return res.status(400).json({ error: 'Escrow payment failed' })

  // Cap maxSubmissions at 35
  const cappedMax = Math.min(maxSubmissions || 35, 35)

  const bountyRef = await db.collection('bounties').add({
    businessUid: uid,
    businessName: business.data().companyName,
    title,
    description,
    requirements,
    skillCategory,
    rewardAmount,
    rewardCurrency: 'USDC',
    deadline: new Date(deadline),
    maxSubmissions: cappedMax,
    currentSubmissions: 0,
    escrowStatus: 'funded',
    paystackReference,
    winnerId: null,
    winnerWalletAddress: null,
    payoutTxSignature: null,
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  res.json({ success: true, bountyId: bountyRef.id })
}
```

### 5.3 Submit to Bounty

**Endpoint: POST `/api/bounties/submit`**
```javascript
const submitToBounty = async (req, res) => {
  const { uid, bountyId, submissionType, content, 
          githubRepoUrl, designUrl } = req.body

  // Check bounty is still open
  const bounty = await db.collection('bounties').doc(bountyId).get()
  const bountyData = bounty.data()

  if (bountyData.status !== 'active') {
    return res.status(400).json({ error: 'This bounty is closed' })
  }

  if (bountyData.currentSubmissions >= bountyData.maxSubmissions) {
    return res.status(400).json({ 
      error: `Bounty has reached max submissions (${bountyData.maxSubmissions})` 
    })
  }

  if (new Date() > bountyData.deadline.toDate()) {
    return res.status(400).json({ error: 'Bounty deadline has passed' })
  }

  // Create submission
  await db.collection('submissions').add({
    bountyId,
    earnerUid: uid,
    submissionType,
    content: content || null,
    githubRepoUrl: githubRepoUrl || null,
    designUrl: designUrl || null,
    submittedByScout: false,
    status: 'submitted',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  // Increment submission count
  await db.collection('bounties').doc(bountyId).update({
    currentSubmissions: admin.firestore.FieldValue.increment(1)
  })

  // Update earner stats
  await db.collection('earner_profiles').doc(uid).update({
    bountiesApplied: admin.firestore.FieldValue.increment(1)
  })

  res.json({ success: true })
}
```

### 5.4 Choose Winner & Release Escrow

**Endpoint: POST `/api/bounties/choose-winner`**
```javascript
const chooseWinner = async (req, res) => {
  const { businessUid, bountyId, winnerUid } = req.body

  // Verify business owns this bounty
  const bounty = await db.collection('bounties').doc(bountyId).get()
  if (bounty.data().businessUid !== businessUid) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  // Get winner wallet address
  const winner = await db.collection('users').doc(winnerUid).get()
  const winnerWalletAddress = winner.data().walletAddress

  // TODO: Backend team triggers smart contract payout here
  // The smart contract reads winnerWalletAddress and releases escrow
  // Store the transaction signature once complete
  
  // Update bounty
  await db.collection('bounties').doc(bountyId).update({
    winnerId: winnerUid,
    winnerWalletAddress,
    escrowStatus: 'released',
    status: 'completed'
  })

  // Update winning submission
  const submissions = await db.collection('submissions')
    .where('bountyId', '==', bountyId)
    .where('earnerUid', '==', winnerUid).get()
  
  submissions.forEach(doc => {
    doc.ref.update({ status: 'winner' })
  })

  // Update earner stats
  const bountyData = bounty.data()
  await db.collection('earner_profiles').doc(winnerUid).update({
    bountiesWon: admin.firestore.FieldValue.increment(1),
    totalEarnings: admin.firestore.FieldValue.increment(bountyData.rewardAmount)
  })

  // Send winner notification
  await addNotification(winnerUid, {
    type: 'bounty_won',
    message: `Congratulations! You won the "${bountyData.title}" bounty!`,
    link: `/quick-gigs/bounty/${bountyId}`
  })

  res.json({ success: true, winnerWalletAddress })
}
```

---

## Module 6 — Blockchain: Solana Integration

**Important:** All blockchain operations run on **Solana Devnet** for demo. No real funds.

### Dependencies
```bash
npm install @solana/web3.js @solana/spl-token
```

### 6.1 Setup
```javascript
const { Connection, PublicKey, Keypair } = require('@solana/web3.js')

const connection = new Connection(
  process.env.SOLANA_RPC_URL, // https://api.devnet.solana.com
  'confirmed'
)

const platformWallet = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(process.env.PLATFORM_WALLET_PRIVATE_KEY))
)
```

### 6.2 Smart Contract Escrow
The escrow smart contract is a Solana program that:
- Locks funds when a bounty is funded
- Releases funds to winner wallet when triggered

**Frontend sends:** winner wallet address
**Backend calls:** smart contract `release_escrow` instruction

```javascript
// Set up UI only — backend team implements smart contract
// When chooseWinner is called:
// 1. Get winnerWalletAddress from Firestore
// 2. Call smart contract release_escrow with winnerWalletAddress
// 3. Store transaction signature in bounty document
// 4. Update escrowStatus to 'released'
```

### 6.3 USDC SPL Token Payments
```javascript
const { getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token')

// USDC Devnet mint address
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')

const transferUSDC = async (fromWallet, toAddress, amount) => {
  const toPublicKey = new PublicKey(toAddress)
  
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, platformWallet, USDC_MINT, fromWallet.publicKey
  )
  
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, platformWallet, USDC_MINT, toPublicKey
  )

  const signature = await transfer(
    connection,
    platformWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet,
    amount * 1e6 // USDC has 6 decimals
  )

  return signature
}
```

---

## Module 7 — Scout: Autonomous AI Agent

Scout is Fynd's named AI agent. It has full knowledge of the platform and the user's account. It can answer questions, work on bounties autonomously, and execute wallet withdrawals.

### Scout's Persona (System Prompt)

```javascript
const buildScoutPrompt = (user, seekerProfile, earnerProfile, openBounties) => `
You are Scout, the AI agent for Fynd — a dual-sided job search 
and quick gigs platform powered by AI and Solana blockchain.

Your personality:
- Sharp, efficient, and proactive like a great personal assistant
- Friendly but direct — no fluff, no filler
- You speak in first person: "I found 3 bounties for you"
- You never mention Gemini, Google, or any AI model
- You never say you are an AI
- You ARE Scout. That is your only identity
- You work exclusively for Fynd

YOUR CAPABILITIES:
1. Answer any question about Fynd platform
2. Answer any question about this user's account
3. Work on bounties autonomously when asked
4. Execute wallet withdrawals via x402 protocol
5. Give career and job market advice

USER ACCOUNT DATA:
- Name: ${user.fullName}
- Credits: ${seekerProfile?.credits || 'N/A'}
- Skills: ${user.skills?.join(', ') || earnerProfile?.skillCategories?.join(', ')}
- Resume Skills: ${seekerProfile?.resumeText ? 'Resume on file' : 'No resume uploaded'}
- Bounties Applied: ${earnerProfile?.bountiesApplied || 0}
- Bounties Won: ${earnerProfile?.bountiesWon || 0}
- Total Earnings: $${earnerProfile?.totalEarnings || 0}
- Scout Tier: ${user.scoutTier}
- Wallet Address: ${user.walletAddress}
- Skill Files Uploaded: ${earnerProfile?.skillMdFiles?.length || 0} files

CURRENT OPEN BOUNTIES ON FYND:
${JSON.stringify(openBounties, null, 2)}

PLATFORM KNOWLEDGE:
- Credits reset to 200 every month (no rollover)
- Each job application costs min 5 credits
- Buy 200 credits for $5 via Paystack
- Bounty max submissions: 35 (can be set lower by business)
- Business verification takes 48 hours
- Job seeker approval takes 1-2 days after interview

If the user asks you to work on a bounty:
1. Check if it exists in the bounty list above
2. Check if it is still active and under max submissions
3. Check the deadline has not passed
4. If all good — confirm with user before starting work
5. If not available — tell them exactly why and suggest alternatives

If the user asks for a withdrawal:
1. Confirm the amount and destination address
2. Use the withdraw_funds function
3. Confirm completion

Always be proactive. After answering, suggest a helpful next step.
`
```

### 7.1 Scout Conversation Handler

**Endpoint: POST `/api/scout/message`**

```javascript
const scoutAI = new GoogleGenerativeAI(process.env.GEMINI_SCOUT_KEY)

const handleScoutMessage = async (req, res) => {
  const { uid, userMessage } = req.body

  // Fetch all user context
  const [userDoc, seekerDoc, earnerDoc, conversationDoc] = await Promise.all([
    db.collection('users').doc(uid).get(),
    db.collection('jobseeker_profiles').doc(uid).get(),
    db.collection('earner_profiles').doc(uid).get(),
    db.collection('scout_conversations').doc(uid).get()
  ])

  const user = userDoc.data()
  const seeker = seekerDoc.exists ? seekerDoc.data() : null
  const earner = earnerDoc.exists ? earnerDoc.data() : null

  // Fetch open bounties for Scout's knowledge
  const openBounties = await db.collection('bounties')
    .where('status', '==', 'active').get()
  const bountiesData = openBounties.docs.map(d => ({ id: d.id, ...d.data() }))

  // Get conversation history
  const history = conversationDoc.exists 
    ? conversationDoc.data().messages.slice(-10) // last 10 messages
    : []

  // Fetch skill.md content if paid tier
  let skillMdContent = ''
  if (user.scoutTier === 'paid' && earner?.skillMdFiles?.length > 0) {
    skillMdContent = earner.skillMdContent || ''
  }

  // Define Scout's tools (function calling)
  const tools = [{
    functionDeclarations: [
      {
        name: 'work_on_bounty',
        description: 'Work on a bounty autonomously on behalf of the user',
        parameters: {
          type: 'object',
          properties: {
            bountyId: { type: 'string', description: 'The bounty ID to work on' },
            bountyType: { 
              type: 'string', 
              enum: ['written', 'code', 'design'],
              description: 'Type of bounty work required'
            }
          },
          required: ['bountyId', 'bountyType']
        }
      },
      {
        name: 'withdraw_funds',
        description: 'Transfer funds from user wallet to another address',
        parameters: {
          type: 'object',
          properties: {
            amount: { type: 'number', description: 'Amount in USDC to transfer' },
            destinationAddress: { type: 'string', description: 'Solana wallet address to send to' }
          },
          required: ['amount', 'destinationAddress']
        }
      }
    ]
  }]

  const model = scoutAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: buildScoutPrompt(user, seeker, earner, bountiesData),
    tools
  })

  const geminiHistory = history.map(m => ({
    role: m.role === 'scout' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const chat = model.startChat({ history: geminiHistory })
  const result = await chat.sendMessage(userMessage)
  const response = result.response

  // Handle function calls from Scout
  if (response.functionCalls()?.length > 0) {
    const functionCall = response.functionCalls()[0]
    
    if (functionCall.name === 'work_on_bounty') {
      const bountyResult = await scoutWorkOnBounty(
        uid, 
        functionCall.args.bountyId,
        functionCall.args.bountyType,
        earner,
        skillMdContent
      )
      
      // Send function result back to Scout for final message
      const finalResult = await chat.sendMessage([{
        functionResponse: {
          name: 'work_on_bounty',
          response: bountyResult
        }
      }])
      
      const scoutMessage = finalResult.response.text()
      await saveScoutMessage(uid, userMessage, scoutMessage)
      return res.json({ message: scoutMessage })
    }

    if (functionCall.name === 'withdraw_funds') {
      const withdrawResult = await executeWithdrawal(
        uid,
        user.walletAddress,
        functionCall.args.destinationAddress,
        functionCall.args.amount
      )
      
      const finalResult = await chat.sendMessage([{
        functionResponse: {
          name: 'withdraw_funds',
          response: withdrawResult
        }
      }])
      
      const scoutMessage = finalResult.response.text()
      await saveScoutMessage(uid, userMessage, scoutMessage)
      return res.json({ message: scoutMessage })
    }
  }

  const scoutMessage = response.text()
  await saveScoutMessage(uid, userMessage, scoutMessage)
  res.json({ message: scoutMessage })
}

const saveScoutMessage = async (uid, userMessage, scoutMessage) => {
  await db.collection('scout_conversations').doc(uid).set({
    messages: admin.firestore.FieldValue.arrayUnion(
      { role: 'user', content: userMessage, timestamp: new Date() },
      { role: 'scout', content: scoutMessage, timestamp: new Date() }
    ),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
}
```

### 7.2 Scout Working on a Bounty

```javascript
const scoutWorkOnBounty = async (uid, bountyId, bountyType, earner, skillMdContent) => {
  // Fetch bounty details
  const bounty = await db.collection('bounties').doc(bountyId).get()
  if (!bounty.exists) return { success: false, reason: 'Bounty not found' }

  const bountyData = bounty.data()

  // Check availability
  if (bountyData.status !== 'active') {
    return { success: false, reason: 'Bounty is closed' }
  }
  if (bountyData.currentSubmissions >= bountyData.maxSubmissions) {
    return { success: false, reason: `Max submissions reached (${bountyData.maxSubmissions})` }
  }
  if (new Date() > bountyData.deadline.toDate()) {
    return { success: false, reason: 'Bounty deadline has passed' }
  }

  const model = scoutAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  let submissionData = {}

  if (bountyType === 'written') {
    // Generate written content
    const prompt = `
      ${skillMdContent ? `User's style guide:\n${skillMdContent}\n\n` : ''}
      Complete this bounty task:
      Title: ${bountyData.title}
      Requirements: ${bountyData.requirements}
      Description: ${bountyData.description}
      
      Produce a complete, high quality submission that fulfills all requirements.
    `
    const result = await model.generateContent(prompt)
    submissionData = { 
      submissionType: 'text', 
      content: result.response.text() 
    }
  }

  if (bountyType === 'code') {
    // Generate code and push to GitHub
    const codePrompt = `
      ${skillMdContent ? `User's coding style:\n${skillMdContent}\n\n` : ''}
      Write complete, working code for this bounty:
      Title: ${bountyData.title}
      Requirements: ${bountyData.requirements}
      
      Return only clean, well-commented code. No explanation.
    `
    const codeResult = await model.generateContent(codePrompt)
    const code = codeResult.response.text()

    // Push to GitHub
    const repoUrl = await pushToGitHub(uid, bountyData.title, code)
    submissionData = { submissionType: 'github_repo', githubRepoUrl: repoUrl }
  }

  if (bountyType === 'design') {
    // Generate HTML design and render to PNG
    const designPrompt = `
      ${skillMdContent ? `User's design style:\n${skillMdContent}\n\n` : ''}
      Create a complete HTML/CSS design for this bounty:
      Title: ${bountyData.title}
      Requirements: ${bountyData.requirements}
      
      Return only complete, styled HTML. Make it visually impressive.
      Use inline CSS only. No external dependencies.
    `
    const designResult = await model.generateContent(designPrompt)
    const designHtml = designResult.response.text()

    // Render HTML to PNG using Puppeteer
    const designUrl = await renderDesignToStorage(designHtml, uid, bountyId)
    submissionData = { submissionType: 'design_png', designUrl }
  }

  // Submit the bounty
  await db.collection('submissions').add({
    bountyId,
    earnerUid: uid,
    ...submissionData,
    submittedByScout: true,
    status: 'submitted',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })

  await db.collection('bounties').doc(bountyId).update({
    currentSubmissions: admin.firestore.FieldValue.increment(1)
  })

  await db.collection('earner_profiles').doc(uid).update({
    bountiesApplied: admin.firestore.FieldValue.increment(1)
  })

  return { 
    success: true, 
    bountyTitle: bountyData.title,
    submissionType: bountyType
  }
}
```

### 7.3 GitHub Integration (Code Bounties)

```javascript
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const pushToGitHub = async (uid, bountyTitle, code) => {
  const repoName = `fynd-${uid.slice(0,6)}-${Date.now()}`
  
  // Create repo
  await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    description: `Fynd bounty submission: ${bountyTitle}`,
    private: false,
    auto_init: true
  })

  // Push code file
  const encoded = Buffer.from(code).toString('base64')
  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_ORG,
    repo: repoName,
    path: 'solution.js',
    message: `Scout submission for: ${bountyTitle}`,
    content: encoded
  })

  return `https://github.com/${process.env.GITHUB_ORG}/${repoName}`
}
```

### 7.4 Design Rendering (Design Bounties)

```javascript
const puppeteer = require('puppeteer')
const { Storage } = require('@google-cloud/storage')

const renderDesignToStorage = async (html, uid, bountyId) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  
  await page.setContent(html)
  await page.setViewport({ width: 1200, height: 800 })
  
  const screenshot = await page.screenshot({ type: 'png' })
  await browser.close()

  // Upload to Firebase Storage
  const storage = new Storage()
  const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET)
  const fileName = `designs/${uid}/${bountyId}-${Date.now()}.png`
  const file = bucket.file(fileName)
  
  await file.save(screenshot, { contentType: 'image/png' })
  await file.makePublic()

  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`
}
```

### 7.5 Scout Wallet Withdrawals via x402

```javascript
const executeWithdrawal = async (uid, fromAddress, toAddress, amount) => {
  // Safety check — verify user owns this wallet
  const user = await db.collection('users').doc(uid).get()
  if (user.data().walletAddress !== fromAddress) {
    return { success: false, reason: 'Wallet mismatch' }
  }

  try {
    // x402 protocol — agent-initiated Solana payment
    // x402 allows Scout to initiate transfers programmatically
    // Implementation uses Solana Pay + x402 spec for machine payments
    
    const signature = await transferUSDC(
      platformWallet,   // Platform acts as authorized agent
      toAddress,
      amount
    )

    // Log withdrawal
    await db.collection('users').doc(uid).collection('withdrawals').add({
      amount,
      fromAddress,
      toAddress,
      signature,
      initiatedByScout: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })

    return { 
      success: true, 
      signature,
      amount,
      toAddress
    }
  } catch (error) {
    return { success: false, reason: error.message }
  }
}
```

---

## Module 8 — Skill.md Upload & Processing

**Endpoint: POST `/api/scout/upload-skill`**

```javascript
const processSkillMd = async (req, res) => {
  const { uid } = req.body
  const file = req.file // Multer middleware for file upload

  // Upload to Firebase Storage
  const storage = new Storage()
  const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET)
  const fileName = `skills/${uid}/${Date.now()}-${file.originalname}`
  const fileRef = bucket.file(fileName)
  
  await fileRef.save(file.buffer)
  const fileUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`

  // Read file content
  const content = file.buffer.toString('utf-8')

  // Append to earner profile
  await db.collection('earner_profiles').doc(uid).update({
    skillMdFiles: admin.firestore.FieldValue.arrayUnion(fileUrl),
    // Concatenate all skill file contents for Scout to use
    skillMdContent: admin.firestore.FieldValue.arrayUnion(content)
  })

  res.json({ success: true, fileUrl })
}
```

---

## Module 9 — Notifications (Realtime)

```javascript
const addNotification = async (uid, notification) => {
  await db.collection('notifications').doc(uid).set({
    notifications: admin.firestore.FieldValue.arrayUnion({
      id: crypto.randomUUID(),
      ...notification,
      read: false,
      createdAt: new Date()
    })
  }, { merge: true })
}

// Usage examples throughout the backend:
// Interview approved
await addNotification(uid, {
  type: 'interview_approved',
  message: 'Congratulations! You have been approved to join Fynd Job Search.',
  link: '/job-search/feed'
})

// Bounty closed (hits max submissions)
await addNotification(businessUid, {
  type: 'bounty_full',
  message: `Your bounty "${title}" has reached max submissions.`,
  link: `/quick-gigs/business/bounty/${bountyId}`
})

// Business verified
await addNotification(uid, {
  type: 'business_verified',
  message: 'Your business has been verified. Start posting bounties!',
  link: '/quick-gigs/business/dashboard'
})
```

---

## Module 10 — Scheduled Jobs (Firebase Cloud Functions)

```javascript
// 1. Monthly credit reset — runs 1st of every month
exports.resetMonthlyCredits = functions.pubsub
  .schedule('0 0 1 * *').onRun(async () => { /* see Module 3 */ })

// 2. Auto-close bounties past deadline — runs every hour
exports.autoCloseBounties = functions.pubsub
  .schedule('0 * * * *').onRun(async () => {
    const now = new Date()
    const expired = await db.collection('bounties')
      .where('status', '==', 'active')
      .where('deadline', '<', now).get()
    
    const batch = db.batch()
    expired.forEach(doc => {
      batch.update(doc.ref, { status: 'closed' })
    })
    await batch.commit()
  })

// 3. Alert if verification pending over 48hrs — runs every 6hrs
exports.verificationAlert = functions.pubsub
  .schedule('0 */6 * * *').onRun(async () => {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const pending = await db.collection('business_profiles')
      .where('verificationStatus', '==', 'pending')
      .where('verificationSubmittedAt', '<', cutoff).get()
    
    if (!pending.empty) {
      await notifyAdminOfPendingVerifications(pending.docs.length)
    }
  })

// 4. Scout proactive greeting — runs on user app open (HTTP trigger)
exports.scoutGreeting = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  const earner = await db.collection('earner_profiles').doc(uid).get()
  
  // Check for closing bounties user has applied to
  // Check for new matching bounties
  // Return proactive Scout message
})
```

---

## Module 11 — Portfolio Generation

**Endpoint: GET `/api/portfolio/:username`**

```javascript
const getPortfolio = async (req, res) => {
  const { username } = req.params

  // Find user by username
  const userQuery = await db.collection('users')
    .where('username', '==', username).get()
  
  if (userQuery.empty) {
    return res.status(404).json({ error: 'Portfolio not found' })
  }

  const user = userQuery.docs[0].data()
  const uid = user.uid

  // Fetch all portfolio data
  const [earnerDoc, submissionsQuery] = await Promise.all([
    db.collection('earner_profiles').doc(uid).get(),
    db.collection('submissions').where('earnerUid', '==', uid).get()
  ])

  const earner = earnerDoc.data()
  const submissions = submissionsQuery.docs.map(d => ({ id: d.id, ...d.data() }))

  const wonSubmissions = submissions.filter(s => s.status === 'winner')
  const appliedSubmissions = submissions.filter(s => s.status !== 'winner')

  // Calculate membership duration
  const memberSince = earner.memberSince.toDate()
  const monthsAsMember = Math.floor(
    (Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )

  res.json({
    name: user.fullName,
    username: user.username,
    bio: earner.bio,
    skills: earner.skillCategories,
    socialLinks: earner.socialLinks,
    memberSince: memberSince.toISOString(),
    memberDuration: `${monthsAsMember} month${monthsAsMember !== 1 ? 's' : ''}`,
    stats: {
      bountiesApplied: earner.bountiesApplied,
      bountiesWon: earner.bountiesWon,
      winRate: earner.bountiesApplied > 0 
        ? Math.round((earner.bountiesWon / earner.bountiesApplied) * 100) 
        : 0,
      totalEarnings: earner.totalEarnings
    },
    bountiesWon: wonSubmissions,
    bountiesApplied: appliedSubmissions
  })
}
```

---

## API Routes Summary

```javascript
// Auth
POST   /api/auth/register

// Job Search - Seeker
POST   /api/jobseeker/enroll
POST   /api/interview/message
POST   /api/interview/coding-question
POST   /api/interview/submit
POST   /api/jobseeker/approve          // Admin only
POST   /api/jobs/apply

// Job Search - Company
POST   /api/company/enroll
POST   /api/company/activate-plan
POST   /api/jobs/post
GET    /api/jobs
GET    /api/jobs/:jobId/applications

// Credits
POST   /api/credits/purchase

// Quick Gigs - Business
POST   /api/quick-gigs/business/apply
POST   /api/quick-gigs/business/verify  // Admin only
POST   /api/bounties/create
POST   /api/bounties/:bountyId/choose-winner

// Quick Gigs - Earner
POST   /api/quick-gigs/earner/enroll
GET    /api/bounties
POST   /api/bounties/submit

// Scout
POST   /api/scout/message
POST   /api/scout/upload-skill

// Portfolio
GET    /api/portfolio/:username

// Notifications
GET    /api/notifications/:uid
POST   /api/notifications/mark-read
```

---

## Security Guidelines

- Always verify Paystack payment server-side before updating any Firestore data
- Never trust frontend for credit deductions — always verify server-side
- Interview tokens must be single-use — mark as used immediately on first access
- Validate business ownership before allowing bounty modifications or winner selection
- Scout withdrawal requests must verify the user's wallet address matches Firestore before executing
- All Solana transactions on devnet only — add mainnet guard check before any transaction
- Rate limit Scout API endpoint to prevent abuse
- Validate skill.md file uploads — text files only, max 500kb

---

## Demo Checklist

Before presenting at the hackathon, verify:

- [ ] LazorKit auth creates user + wallet address stored in Firestore
- [ ] Interview token email sends correctly
- [ ] Fluffy asks exactly 3 questions then transitions to coding test
- [ ] Coding test 20 second timer auto-submits
- [ ] Paystack test mode accepting test card payments
- [ ] Credit deduction works on job swipe-right
- [ ] Bounty creation with Paystack escrow payment works
- [ ] Scout answers account questions correctly
- [ ] Scout can work on a written bounty and submit
- [ ] Scout can push code to GitHub repo
- [ ] Scout can render design HTML to PNG and submit
- [ ] Scout x402 withdrawal executes on devnet
- [ ] Winner selection updates bounty and earner stats
- [ ] Portfolio endpoint returns correct user data
- [ ] All blockchain activity on Solana devnet only
