# iOS App Store Launch — Manual Steps

## Step 1: Apple Developer Portal — Enable Sign in with Apple

1. Go to **[developer.apple.com/account](https://developer.apple.com/account)**
2. Click **Certificates, Identifiers & Profiles** in the left sidebar
3. Click **Identifiers** in the left sidebar
4. Find your App ID: **`com.thedadcenter.app`**
   - If it doesn't exist yet, click the **+** button to register a new App ID
   - Select **App IDs** → Continue
   - Select **App** → Continue
   - Description: `The Dad Center`
   - Bundle ID (Explicit): `com.thedadcenter.app`
5. Click on the App ID to edit it
6. Scroll down to **Capabilities** and check the box for **Sign In with Apple**
7. Click **Save**

**Note your Team ID** — you'll need it for Step 4. Find it at:
- Top-right corner of the developer portal, or
- **Membership Details** in the left sidebar → **Team ID** (10-character alphanumeric string like `A1B2C3D4E5`)

---

## Step 2: Supabase Dashboard — Enable Apple Auth Provider

1. Go to **[supabase.com/dashboard/project/oeeeiquclwfpypojjigx](https://supabase.com/dashboard/project/oeeeiquclwfpypojjigx)**
2. Click **Authentication** in the left sidebar
3. Click **Providers**
4. Find **Apple** in the provider list and click to expand it
5. Toggle **Enable Sign in with Apple** to ON
6. Fill in the required fields:

   **For native iOS apps (identity token flow), you only need:**
   - **Authorized Client IDs**: Enter your bundle ID: `com.thedadcenter.app`

   The `lib/apple-auth.ts` implementation uses `signInWithIdToken` (native identity token), not the web OAuth flow. This means you do NOT need to set up a Services ID, Key, or redirect URL — Supabase validates the Apple identity token directly.

7. Click **Save**

**Verify it works:**
- The Supabase Apple provider must be enabled BEFORE testing Apple Sign-In in the app
- Without this, `signInWithIdToken({ provider: 'apple' })` will return an error

---

## Step 3: Deploy the Delete Account Edge Function

From your terminal:

```bash
# 1. Navigate to the project root
cd ~/Projects/parentlogs

# 2. Deploy the function
supabase functions deploy delete-account

# 3. Verify it deployed
supabase functions list
```

You should see `delete-account` in the list with status `Active`.

**Test it works (optional but recommended):**

```bash
# Get a test user's access token (sign in via the app first, then):
# In the app, the settings screen already calls this endpoint at:
# ${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account

# You can test with curl using a valid JWT:
curl -X POST \
  https://oeeeiquclwfpypojjigx.supabase.co/functions/v1/delete-account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Important:** Don't test with your real account. Create a throwaway test account first.

**If you get a permissions error:** The function uses `SUPABASE_SERVICE_ROLE_KEY` which is automatically available to edge functions. If `supabase.auth.admin.deleteUser()` fails, check that the service role key is set in your Supabase project's Edge Function environment (it should be automatic).

---

## Step 4: Fill in `eas.json` Placeholders

You need two values:

### Find your Apple Team ID
- From Step 1 above (Apple Developer Portal → Membership Details)
- It's a 10-character string like `A1B2C3D4E5`

### Find (or create) your App Store Connect App ID
1. Go to **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)**
2. Click **Apps**
3. If the app doesn't exist yet, click the **+** button → **New App**:
   - **Platforms:** iOS
   - **Name:** The Dad Center
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Select `com.thedadcenter.app` (from the dropdown — it should appear after Step 1)
   - **SKU:** `thedadcenter` (any unique string)
   - **User Access:** Full Access
   - Click **Create**
4. Once created, the **Apple ID** (a ~10-digit number like `6744329185`) appears in the **App Information** section under **General**. This is your `ascAppId`.

### Update the file

Open `apps/mobile/eas.json` and replace the placeholders:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_10_DIGIT_NUMBER",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

---

## Step 5: App Store Connect — Create Listing & Metadata

Stay in **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)** → Your app → **App Store** tab.

### 5a. App Information (General → App Information)

| Field | Value |
|-------|-------|
| Name | The Dad Center |
| Subtitle | The Operating System for Fatherhood |
| Category (Primary) | Health & Fitness |
| Category (Secondary) | Lifestyle |
| Content Rights | Does not contain third-party content |
| Age Rating | Click **Edit** → answer questionnaire (expected result: **4+** or **12+** if mood tracking counts) |

### 5b. Pricing and Availability (General → Pricing and Availability)

- Price: **Free** (in-app purchases handle subscriptions)
- Availability: All territories (or select specific countries)

### 5c. In-App Purchases (Features → In-App Purchases)

RevenueCat creates these automatically when you set up products. Verify these exist:

| Product ID | Type | Price |
|------------|------|-------|
| `tdc_monthly_499` (or similar) | Auto-Renewable Subscription | $4.99 |
| `tdc_annual_3999` (or similar) | Auto-Renewable Subscription | $39.99 |
| `tdc_lifetime_9999` (or similar) | Non-Consumable | $99.99 |

If they don't exist, create them in RevenueCat dashboard first — RevenueCat syncs to App Store Connect.

### 5d. Version Information (App Store → iOS App → version page)

**Screenshots** (required — minimum 2 per device size):

- **6.7" Display** (iPhone 15 Pro Max): 1290 x 2796 px
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 px (optional but recommended)
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 px (optional)

Capture 5-6 screenshots showing:

1. Landing/marketing screen
2. Dashboard
3. Weekly briefing
4. Task management
5. Budget planner
6. Baby tracker

You can capture these from the Simulator:

```bash
# Run the app in simulator
npx expo run:ios

# Take screenshots: Cmd+S in Simulator (saves to Desktop)
# Or: xcrun simctl io booted screenshot screenshot.png
```

**Promotional Text** (170 chars, can be updated without review):

```
Week-by-week guidance for new dads. Smart task management, baby tracking, and budget planning — all personalized to your due date.
```

**Description** (4000 chars max):

```
The Dad Center is the operating system for modern fatherhood. Built by a dad, for dads who refuse to wing it.

GET PERSONALIZED WEEKLY BRIEFINGS
Know exactly what's happening each week of pregnancy and your baby's first year. No fluff, no condescension — just clear, actionable guidance timed to your exact week.

SMART TASK MANAGEMENT
200+ pre-loaded tasks timed to your due date. Hospital bag? Car seat installation? Insurance updates? We've got every critical task covered so nothing falls through the cracks.

BABY TRACKER
Log feeds, diapers, sleep, and milestones in seconds. Track patterns and share updates with your partner in real-time.

BUDGET PLANNER
Plan the actual cost of parenthood with 200+ real-priced items. Know what's a must-have vs. nice-to-have, with pricing that reflects what things actually cost.

PARTNER SYNC
One subscription covers your whole family. Both partners share tasks, track the baby, and stay aligned — all in real-time.

THE DAD JOURNEY
Seven challenge pillars covering knowledge, planning, finances, anxiety, baby bonding, relationship, and extended family. Daily mood check-ins to track how you're really doing.

SUBSCRIPTION OPTIONS
- Monthly: $4.99/mo
- Annual: $39.99/yr ($3.33/mo — save 33%)
- Lifetime: $99.99 one-time purchase

Free tier includes 4 weeks of briefings, 30-day task window, and basic baby tracking.

The Dad Center provides general pregnancy and parenting information for educational purposes only. It is not intended as medical advice. Always consult your healthcare provider for medical decisions.
```

**Keywords** (100 chars):

```
dad,father,pregnancy,baby,parenting,tracker,tasks,briefing,budget,newborn,fatherhood,due date
```

**Support URL**: `https://thedadcenter.com/support`
(If this page doesn't exist yet, use `https://thedadcenter.com` and create a support page later)

**Marketing URL**: `https://thedadcenter.com`

**Privacy Policy URL**: `https://thedadcenter.com/privacy`

### 5e. App Review Information

| Field | Value |
|-------|-------|
| Contact First Name | Ashirbad |
| Contact Last Name | Ghosh |
| Contact Email | (your email) |
| Contact Phone | (your phone) |
| Demo Account Email | (create a test account — see below) |
| Demo Account Password | (test account password) |
| Notes for Review | "The Dad Center is a pregnancy and parenting companion app designed for expectant and new fathers. It provides week-by-week briefings, task management, baby tracking, and budget planning. The app offers a free tier with limited access and premium subscriptions via in-app purchase. Sign in with Apple, Google, or email/password." |

**Create a review test account:**

```bash
# Sign up in the app with a test email, complete onboarding
# Use something like: review@thedadcenter.com / TestReview123!
# Complete onboarding (select role, enter a due date)
# Make sure the account lands on the dashboard with visible content
```

### 5f. Privacy Nutrition Labels (App Privacy → Get Started)

When prompted "Does your app collect data?", select **Yes**, then declare:

| Data Type | Linked to Identity | Used for Tracking |
|-----------|-------------------|-------------------|
| Email Address | Yes | No |
| Name | Yes | No |
| User ID | Yes | No |
| Health & Fitness (due date, mood) | Yes | No |
| Other User Content (tasks, budget) | Yes | No |
| Purchase History | Yes | No |

For each, the **purpose** is: **App Functionality**

Click **Publish** when done.

---

## Step 6: Prebuild, Build & Submit to TestFlight

### 6a. Regenerate native projects

```bash
cd ~/Projects/parentlogs/apps/mobile

# Clean and regenerate iOS native project with new entitlements
npx expo prebuild --clean --platform ios
```

This regenerates the `ios/` directory with:
- Sign in with Apple entitlement
- `expo-apple-authentication` native module
- `@react-native-community/datetimepicker` native module
- `@react-native-community/netinfo` native module
- Updated `PrivacyInfo.xcprivacy`

### 6b. Build the production IPA

```bash
# Build for App Store distribution (runs on EAS cloud)
eas build --platform ios --profile production
```

- First time: EAS will ask to log in to your Apple account
- It will generate/manage the distribution certificate and provisioning profile automatically
- Build takes ~15-20 minutes
- When complete, you'll get a link to download the IPA

### 6c. Submit to App Store Connect

```bash
# Submit the latest build to App Store Connect
eas submit --platform ios
```

- This uploads the IPA to App Store Connect
- If `eas.json` has the correct `ascAppId` and `appleTeamId`, it connects automatically
- First time may ask for an App Store Connect API key — follow the prompts

### 6d. Set up TestFlight

1. Go to **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)** → Your app → **TestFlight** tab
2. The build should appear (may take 5-10 minutes to process after upload)
3. If it says "Missing Compliance", click **Manage** → select "None of the algorithms mentioned above" (since `usesNonExemptEncryption: false` is already set)
4. **External Testing:**
   - Click **External Testing** → **+** to create a new group (e.g., "Friends & Family")
   - Click **Add Testers** → enter email addresses of friends who want to test
   - Click the **+** next to **Builds** → select your build
   - Click **Submit for Review** — this submits for Beta App Review (24-48 hours first time, usually faster after that)
5. Once approved, testers receive an email invitation to install via the **TestFlight** app

**Alternative — Public TestFlight Link:**
- In the External Testing group, toggle **Enable Public Link**
- Share the generated link — anyone with it can join (up to 10,000 testers)

### 6e. Verify on a real device

Once the TestFlight build is available:

- [ ] Install via TestFlight on a physical iPhone
- [ ] Sign up with email → complete onboarding → lands on dashboard
- [ ] Sign in with Google → works end-to-end
- [ ] Sign in with Apple → works end-to-end
- [ ] All 5 tabs load: Home, Tasks, Briefing, Tracker, More
- [ ] Open Settings → Legal → Privacy Policy opens in browser
- [ ] Open Settings → Legal → Terms of Service opens in browser
- [ ] Open Settings → About → medical disclaimer visible
- [ ] Go to Upgrade screen → full legal text visible + policy links tappable
- [ ] Purchase a subscription (sandbox) → premium unlocks
- [ ] Restore purchases works
- [ ] Toggle Airplane Mode → offline banner appears, no crashes
- [ ] Manage Subscription → opens Apple subscription settings
- [ ] Delete Account → confirmation dialog → account deleted → redirects to landing
- [ ] Multiple iPhone sizes (SE, standard, Pro Max) — no layout breaks

---

## Submit to App Store

After TestFlight is verified, go to App Store Connect → your app → **App Store** tab → click **Submit for Review** on the version page. First review typically takes 24-48 hours.
