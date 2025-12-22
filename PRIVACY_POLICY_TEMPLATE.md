# Privacy Policy Template for Garden Genie AI

**INSTRUCTIONS:**
1. Fill in all [BRACKETS] with your actual information
2. Review and customize each section based on your actual practices
3. Have a lawyer review if handling sensitive data
4. Host this on a public URL (your website, GitHub Pages, etc.)
5. Add the URL to your app.json under android.privacyPolicy

---

# Privacy Policy for Garden Genie AI

**Last updated:** [DATE]

## Introduction

This Privacy Policy describes how [YOUR COMPANY NAME / "Hydrofarm Tech"] ("we", "us", or "our") collects, uses, and shares information when you use the Garden Genie AI mobile application ("App").

## Information We Collect

### Information You Provide

1. **Phone Number**
   - We collect your phone number for authentication and account creation
   - Used to send OTP (One-Time Password) for login verification
   - Stored securely in our database

2. **Plant Photos**
   - Photos of plants you upload for disease diagnosis
   - Processed by our AI system to identify plant health issues
   - [SPECIFY: Stored for X days / Deleted after processing / Stored in your history]

3. **Usage Data**
   - Diagnosis history and results
   - App interactions and feature usage
   - [If applicable: Device information, IP address, app version]

### Automatically Collected Information

- **Device Information:** Device type, operating system version
- **Log Data:** App crashes, errors, and performance data
- **Analytics:** [If using analytics tools like Firebase, Google Analytics, etc. - specify]

## How We Use Your Information

We use the collected information for:

1. **Core Functionality**
   - Authenticating your identity via phone number OTP
   - Processing plant photos through our AI diagnosis system
   - Providing disease identification and care recommendations
   - Storing your diagnosis history for future reference

2. **App Improvement**
   - Analyzing usage patterns to improve features
   - Fixing bugs and technical issues
   - Enhancing AI accuracy and recommendations

3. **Communication**
   - Sending OTP codes for authentication
   - [If applicable: Sending important app updates or security notifications]

## Data Sharing and Third Parties

### We Share Data With:

1. **AI Service Providers**
   - [SPECIFY: Name of AI service if using external APIs like OpenAI, Google Cloud Vision, etc.]
   - Plant photos are sent to [SERVICE NAME] for analysis
   - [Link to their privacy policy]

2. **Authentication Services**
   - [If using Firebase Auth, Twilio, etc. - specify]
   - Phone numbers processed through [SERVICE NAME] for OTP delivery

3. **Cloud Hosting**
   - [SPECIFY: AWS, Google Cloud, Azure, etc.]
   - Data stored on [PROVIDER] servers in [REGION]

4. **Analytics** (if applicable)
   - [Google Analytics, Firebase Analytics, etc.]
   - Anonymized usage statistics

### We DO NOT:
- Sell your personal information to third parties
- Share your photos publicly without permission
- Use your data for advertising purposes [MODIFY if you show ads]

## Data Retention

- **Phone Numbers:** Retained while your account is active, deleted [X] days after account deletion
- **Plant Photos:** [CHOOSE ONE:]
  - Deleted immediately after AI processing
  - Stored for [X] days in your diagnosis history
  - Retained indefinitely unless you request deletion
- **Diagnosis History:** Stored until you delete your account or request removal

## Your Rights and Choices

You have the right to:

1. **Access Your Data**
   - Request a copy of your personal information
   - Contact: [YOUR EMAIL]

2. **Delete Your Data**
   - Delete individual diagnosis records in the app
   - Request complete account deletion
   - [Specify process: Contact support or in-app option]

3. **Opt-Out**
   - [If applicable: Opt out of analytics or non-essential data collection]

4. **Correct Your Data**
   - Update your phone number
   - [Other correctable information]

## Data Security

We implement industry-standard security measures:

- [If using HTTPS:] Encrypted data transmission using HTTPS/SSL
- Secure authentication via OTP
- [Other measures: Database encryption, access controls, etc.]

**Note:** No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.

## Children's Privacy

Garden Genie AI is not directed to children under 13 [or your local age of consent]. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us.

## International Users

[If applicable:]
Your information may be transferred to and processed in [COUNTRY] where our servers are located. By using the App, you consent to this transfer.

**For EU Users (GDPR):**
- Legal basis for processing: Consent and legitimate interests
- Data transfers comply with GDPR requirements
- You have additional rights under GDPR including data portability

## Changes to This Privacy Policy

We may update this Privacy Policy periodically. We will notify you of significant changes by:
- Updating the "Last updated" date
- [If applicable: In-app notification or email]
- Posting the new policy at [URL]

Your continued use after changes constitutes acceptance of the updated policy.

## Camera and Storage Permissions

### Why We Request Permissions:

- **Camera:** To take photos of plants for AI diagnosis
- **Photo Library (Media Images):** To select existing plant photos from your device
- **[Other permissions]:** [Explain purpose]

We only access these permissions when you explicitly use these features. We do not access your camera or photos in the background.

## Contact Us

If you have questions about this Privacy Policy or our data practices:

**Email:** [support@gardengenie.in or YOUR EMAIL]
**Address:** [YOUR COMPANY ADDRESS]
**Phone:** [YOUR SUPPORT PHONE]
**Website:** [https://gardengenie.in or YOUR WEBSITE]

## Legal Compliance

This app complies with:
- Google Play Store policies
- [If applicable: GDPR (EU), CCPA (California), PIPEDA (Canada), etc.]
- Local data protection laws in [YOUR JURISDICTION]

---

## Quick Hosting Options

### Option 1: GitHub Pages (Free)
1. Create a new repository: `garden-genie-privacy-policy`
2. Add this content as `index.md`
3. Enable GitHub Pages in repository settings
4. URL: `https://[yourusername].github.io/garden-genie-privacy-policy`

### Option 2: Your Website
1. Host on your company website
2. URL: `https://gardengenie.in/privacy-policy`

### Option 3: Privacy Policy Generators
- https://www.privacypolicygenerator.info/
- https://www.termsfeed.com/privacy-policy-generator/
- https://www.freeprivacypolicy.com/

### Option 4: Dedicated Services
- iubenda.com
- termly.io
- getterms.io

---

**After hosting, add to app.json:**

```json
"android": {
  "privacyPolicy": "https://your-actual-privacy-policy-url.com",
  ...
}
```
