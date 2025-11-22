# OpenAI Budget & Cost Control Setup

## 🚨 Critical: Set Budget Limits BEFORE MVP Launch

To prevent unexpected costs during MVP testing, follow these steps to set up OpenAI usage limits.

---

## Step 1: Access OpenAI Platform

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in with your OpenAI account
3. Navigate to **Settings** → **Limits**

---

## Step 2: Set Monthly Budget Cap

### Recommended MVP Limits:

- **Soft Limit**: $50/month (warning notification)
- **Hard Limit**: $100/month (API access disabled)

### How to Set:

1. Go to **Settings** → **Limits** → **Usage limits**
2. Click **Set up payment limit**
3. Set:
   - **Soft limit**: `$50` (you'll get an email warning)
   - **Hard limit**: `$100` (API will stop working to prevent overspending)
4. Click **Save**

---

## Step 3: Set Up Email Alerts

1. Go to **Settings** → **Limits** → **Email preferences**
2. Enable:
   - ✅ Usage warnings at 50%, 75%, 90% of budget
   - ✅ Budget exceeded notifications
   - ✅ Unusual activity alerts

---

## Step 4: Monitor Usage Dashboard

### Daily Monitoring (Recommended for MVP):

1. Go to **Usage** tab in OpenAI dashboard
2. Check daily:
   - **Total spent today**
   - **Top endpoints by cost**
   - **Request volume trends**

### What to Watch For:

- 🚨 Sudden spikes in requests
- 🚨 Costs exceeding $5/day during MVP
- 🚨 Unusual patterns (potential abuse)

---

## Cost Estimates for VoiceClara

### Per-Request Costs (Approximate):

| Endpoint | Model | Avg Tokens | Cost per Request |
|----------|-------|------------|------------------|
| `/api/ai-coach` | gpt-4o-mini | ~1,500 | ~$0.002 |
| `/api/analyze-feedback` | gpt-4o-mini | ~1,000 | ~$0.001 |
| `/api/analyze-results` | gpt-4o | ~3,000 | ~$0.015 |
| `/api/generate-questions` | gpt-4o-mini | ~500 | ~$0.0005 |

### Monthly Cost Estimates:

**Conservative MVP (100 users, light usage):**
- ~500 feedback submissions/month
- ~100 full analyses/month
- ~200 AI coach requests/month
- **Estimated cost**: $15-25/month

**Moderate Usage (500 users):**
- ~2,000 feedback submissions/month
- ~500 full analyses/month
- ~1,000 AI coach requests/month
- **Estimated cost**: $60-80/month

**Heavy Usage (1,000+ users):**
- ~5,000+ feedback submissions/month
- ~1,500+ full analyses/month
- ~3,000+ AI coach requests/month
- **Estimated cost**: $150-200/month

---

## Rate Limiting Protection (Already Implemented ✅)

VoiceClara has built-in rate limiting to prevent abuse:

```typescript
// lib/rate-limit.ts
export const RATE_LIMITS = {
  AI_GENERATION: { limit: 10, window: 60 },      // 10 req/min
  AI_ANALYSIS: { limit: 5, window: 60 },         // 5 req/min
  SEND_EMAIL: { limit: 20, window: 60 },         // 20 emails/min
  SEND_INVITATION: { limit: 50, window: 3600 },  // 50 invites/hour
}
```

These limits protect against:
- ✅ Accidental loops
- ✅ Malicious abuse
- ✅ Unexpected cost spikes

---

## Emergency Actions if Budget Exceeded

### If you receive a budget alert:

1. **Immediate Actions:**
   - Check OpenAI dashboard for unusual activity
   - Review Vercel logs for request patterns
   - Temporarily reduce rate limits in `lib/rate-limit.ts`

2. **Investigate:**
   - Look for spam or abuse patterns
   - Check if a specific user/IP is making excessive requests
   - Review error logs for retry loops

3. **Adjust Limits:**
   ```typescript
   // Temporary emergency rate limiting
   AI_GENERATION: { limit: 5, window: 60 },   // Reduce from 10 to 5
   AI_ANALYSIS: { limit: 2, window: 60 },     // Reduce from 5 to 2
   ```

4. **Contact OpenAI Support:**
   - If you suspect abuse: support@openai.com
   - Request refund for fraudulent usage if applicable

---

## Cost Optimization Tips

### 1. Use Caching (Already Implemented ✅)

VoiceClara caches AI analysis results in the database:

```typescript
// app/api/analyze-results/route.ts
// Results are stored in 'ai_analysis' table
// Subsequent requests return cached results
```

### 2. Batch Requests

Instead of analyzing each feedback individually, batch them:
- Wait for 3+ responses before AI analysis
- Analyze all responses together (more efficient)

### 3. Use Cheaper Models for Simple Tasks

- ✅ `gpt-4o-mini` for feedback quality scoring
- ✅ `gpt-4o-mini` for AI Coach suggestions
- ✅ `gpt-4o` only for complex multi-response analysis

### 4. Implement Response Deduplication

If someone submits the same feedback twice, don't analyze it twice.

---

## Monitoring Tools

### OpenAI Dashboard
- **URL**: [platform.openai.com/usage](https://platform.openai.com/usage)
- **Check**: Daily during MVP

### Vercel Analytics
- **URL**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Monitor**: Function invocations, errors, timeouts

### Supabase Database
- **Check**: Number of AI analysis records created per day
- **Query**:
  ```sql
  SELECT DATE(created_at), COUNT(*)
  FROM ai_analysis
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at);
  ```

---

## Checklist Before MVP Launch

- [ ] ✅ OpenAI monthly budget cap set ($100 hard limit)
- [ ] ✅ Email alerts enabled for usage warnings
- [ ] ✅ Rate limiting implemented in all AI endpoints
- [ ] ✅ Caching enabled for AI analysis results
- [ ] ✅ Monitoring dashboard bookmarked
- [ ] ✅ Emergency contact list prepared:
  - OpenAI Support: support@openai.com
  - Vercel Support: [vercel.com/support](https://vercel.com/support)
  - Your team's emergency contact

---

## Additional Resources

- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Usage Limits](https://platform.openai.com/docs/guides/rate-limits)
- [GPT-4o Pricing Calculator](https://platform.openai.com/tokenizer)

---

## Questions?

If you have questions about OpenAI costs or rate limiting:
- Check OpenAI's [Help Center](https://help.openai.com)
- Review VoiceClara's rate limiting code in `lib/rate-limit.ts`
- Contact the development team

---

**Last Updated**: January 2025
**Status**: ✅ Rate limiting implemented, budget setup required before launch
