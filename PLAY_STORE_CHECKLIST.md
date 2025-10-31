# Google Play Store Submission Checklist for Garden Genie AI

## ✅ Changes Made

### 1. App Configuration (app.json)


- ✅ Added app description
- ✅ Changed display name to "Garden Genie AI"
- ✅ Added version code (versionCode: 1)
- ✅ Updated permissions for Android 13+ compatibility
- ✅ Blocked deprecated storage permissions
- ✅ Changed minSdkVersion from 34 to 24 (wider device support)
- ✅ Disabled cleartext traffic (security requirement)
- ✅ Added network security config


### 2. Permissions (AndroidManifest.xml)

- ✅ Added modern media permissions (READ_MEDIA_IMAGES, READ_MEDIA_VIDEO)
- ✅ Limited legacy storage permissions to Android 12 and below (maxSdkVersion="32")
- ✅ Added permission usage comments/documentation
- ✅ Added camera feature declaration (not required, allows devices without camera to install)


### 3. Security

- ✅ Created network_security_config.xml to control HTTP/HTTPS traffic
- ✅ Configured to allow HTTPS by default
- ✅ Added temporary exception for development server (13.233.21.86)


## ⚠️ CRITICAL - TODO Before Production Release

### 1. **PRIVACY POLICY (REQUIRED)**

You MUST create and host a privacy policy. Add the URL to app.json:

```json
"android": {
  "privacyPolicy": "https://yourdomain.com/privacy-policy"

}
```

**What to include in your privacy policy:**

- What data you collect (photos, phone numbers, location if any)
- How you use the data (AI analysis, authentication)
- Whether data is shared with third parties

- How long data is retained<https://www.privacypolicygenerator.info/>
- User rights (deletion, access to data)
- Contact information

**Quick options:**


- Use a privacy policy generator: <https://www.privacypolicygenerator.info/>
- Host on your website or GitHub Pages
- Use services like iubenda or termly

### 2. **HTTPS ENDPOINT (HIGHLY RECOMMENDED)**


Replace HTTP server with HTTPS:

**Current:** `http://13.233.21.86`
**Should be:** `https://api.gardengenie.in` (or your domain with SSL certificate)


**Why:**


- Google Play strongly discourages cleartext traffic
- Required for handling sensitive data (phone numbers, user photos)
- Better security for your users

**How to fix:**


1. Get an SSL certificate (free with Let's Encrypt)
2. Configure your server for HTTPS
3. Update app.json:

   ```json
   "extra": {

     "BASE_URL": "https://api.gardengenie.com"
   }
   ```


4. Remove cleartext traffic exception from network_security_config.xml

### 3. **STORE LISTING ASSETS**


Create these assets for Play Store:

**App Icon:**

- ✅ Already have: GardenGenieIcon.png
- Verify it's 512x512 PNG with transparent background

**Feature Graphic:**


- Size: 1024 x 500 px
- Showcases your app's main feature

**Screenshots (Required - minimum 2):**


- Phone: 1080 x 1920 px or higher
- Show key features:
  - Plant photo upload screen
  - AI diagnosis results
  - Chat/recommendations
  - History/previous diagnoses

**App Description:**
Short description (80 chars max):


```
AI plant doctor - Diagnose diseases, get instant care advice
```

Full description (4000 chars max) - include:


- What the app does
- Key features
- How it helps gardeners

- Any limitations

### 4. **DATA SAFETY FORM**


When submitting to Play Store, you'll fill out a Data Safety form. Here's what to declare:

**Data Collected:**


- Phone number (for authentication)

- Photos (for plant diagnosis)
- Usage data (diagnosis history)

**Data Usage:**



- Account management (phone number)
- App functionality (photos for AI analysis)

**Data Sharing:**


- Declare if you share data with third-party services
- Mention if photos are sent to external AI service

**Data Security:**

- Data is encrypted in transit (if using HTTPS)
- Declare your data retention policy

### 5. **CONTENT RATING**

Complete the IARC questionnaire:

- Expected rating: Everyone or 3+ (it's a gardening app)
- No violence, mature content, or gambling

### 6. **APP CATEGORIES**

Suggested categories:

- Primary: Tools or Lifestyle
- Secondary: Education

### 7. **TARGET AUDIENCE**

- Target age: All ges
- Appeals to: Home gardeners, plant enthusiasts, farmers

## 🔍 Testing Before Submission

### Test these scenarios

1. **Permissions Flow:**
   - Camera permission request appears when taking photo
   - Photo picker works when selecting from gallery
   - App gracefully handles permission denial

2. **Different Android Versions:**

   - Test on Android 13+ (uses READ_MEDIA_IMAGES)
   - Test on Android 12 and below (uses READ_EXTERNAL_STORAGE)

3. **Network Connectivity:**
   - App handles offline state

   - Proper error messages when server unreachable

4. **Authentication:**
   - OTP flow works correctly
   - Phone number validation
   - Session management

### Build Commands

```bash
# Production build
npm run build:production:android:local

# Or using EAS (recommended)
eas build -p android --profile production
```

## 📝 App Store Listing Text Templates

### Short Description (80 chars)

```
AI plant doctor - Diagnose diseases & get instant gardening advice
```

### Full Description Template

```
🌱 Garden Genie AI - Your Personal Plant Doctor

Struggling with sick plants? Not sure what's wrong with your garden? Garden Genie AI uses advanced artificial intelligence to instantly diagnose plant diseases and provide expert care recommendations.

✨ KEY FEATURES:

📸 Instant Diagnosis
Simply take or upload a photo of your plant, and our AI will identify diseases, pests, and nutrient deficiencies in seconds.

💬 Expert Recommendations
Get personalized treatment plans, care tips, and product recommendations to nurse your plants back to health.

📚 Diagnosis History
Track all your plant diagnoses and revisit previous recommendations anytime.

🤖 AI-Powered Chat
Ask questions about plant care and get instant expert advice powered by AI.

🎯 WHO IS THIS FOR?
- Home gardeners managing vegetable gardens
- Plant enthusiasts caring for houseplants
- Farmers monitoring crop health
- Anyone who wants healthier, thriving plants


🔒 PRIVACY & SECURITY
Your plant photos are processed securely and used only for diagnosis. We respect your privacy and never share your personal information.


Download Garden Genie AI today and give your plants the care they deserve!

---
Support: support@gardengenie.in
Website: https://gardengenie.in

```

## 🚀 Submission Steps

1. ✅ Complete all "TODO Before Production Release" items above
2. Build production APK/AAB
3. Create Google Play Developer account ($25 one-time fee)

4. Upload app to Play<https://support.google.com/googleplay/android-developer>
5. Fill out store<https://play.google.com/about/developer-content-policy/>
6. Complete Data Safety form
7. Complete Content Rating questionnaire
8. Set pricing (Free) and countries
9. Submit for review

**Review time:** Usually 1-7 days

## 🔧 Technical Improvements Made

### minSdkVersion Changed: 34 → 24

**Why:** Your original minSdkVersion of 34 would exclude 95%+ of Android devices. Only Android 14+ devices would be able to install. By changing to 24 (Android 7.0), you support devices from 2016 onwards, covering 99%+ of active Android devices.

### Network Security

- Disabled cleartext traffic globally (security requirement)
- Added controlled exception for your specific development server
- This configuration is acceptable for Play Store but should be updated to HTTPS for production

### Permissions

- Updated for Android 13+ granular media permissions
- Maintained backward compatibility with older Android versions
- Removed unnecessary write permissions (scoped storage handles this)

## 📞 Support

If you have questions during submission:

- Play Console Help: <https://support.google.com/googleplay/android-developer>
- Policy Center: <https://play.google.com/about/developer-content-policy/>

---
Last Updated: 2025-10-18
App Version: 1.0.0 (versionCode: 1)
