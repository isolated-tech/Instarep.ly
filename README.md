# Instarep.ly

The AI keyboard rethinking how creators reply.

## Setup

### Environment Variables

This project uses Kit.com to collect waitlist email addresses. To set this up:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Kit.com API key:
   - Go to [Kit.com Account Settings > Advanced Settings](https://app.kit.com/account_settings/advanced_settings)
   - Create an API key (either v3 or v4 will work)
   - Copy the API key

3. Add your API key to `.env.local`:
   ```
   KIT_API_KEY=your_actual_api_key
   KIT_TAG_NAME=instareply-waitlist
   ```

   The `KIT_TAG_NAME` is optional and defaults to `instareply-waitlist`. This tag will be automatically created in your Kit.com account and applied to all subscribers from the waitlist, making it easy to identify and segment them.

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
