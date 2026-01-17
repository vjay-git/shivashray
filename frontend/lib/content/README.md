# Hotel Marketing Content

This directory contains all marketing and descriptive content for Shivashray Banaras hotel, extracted from factual information on the official website (shivashraybanaras.com).

## Content Structure

The `hotel-content.ts` file contains:

### Basic Information
- Hotel name: `hotelContent.name`
- Tagline: `hotelContent.tagline`
- Description: `hotelContent.description`

### Location
- Full address: `hotelContent.location.address`
- City and state: `hotelContent.location.city`, `hotelContent.location.state`
- Proximity description: `hotelContent.location.proximity`

### Contact
- Phone: `hotelContent.contact.phone`
- Email: `hotelContent.contact.reservationEmail`

### Room Types
- Double Room: `hotelContent.rooms.double`
- Deluxe Room: `hotelContent.rooms.deluxe`
- Spacious Room: `hotelContent.rooms.spacious`

### Amenities
- List of all amenities: `hotelContent.amenities`

### Marketing Content
- Hero section: `hotelContent.marketing.hero`
- About page: `hotelContent.marketing.about`
- Services page: `hotelContent.marketing.services`

### Social Media Content
- Instagram captions: `hotelContent.social.instagram.captions`
- Instagram hashtags: `hotelContent.social.instagram.hashtags`
- WhatsApp messages: `hotelContent.social.whatsapp`

### Ad Copy
- Google Ads: `hotelContent.ads.google`
- Facebook Ads: `hotelContent.ads.facebook`

### Booking Descriptions
- Overview: `hotelContent.booking.overview`
- Why Choose Us: `hotelContent.booking.whyChoose`

## Usage in Components

```typescript
import { hotelContent } from '@/lib/content/hotel-content';

// Use in component
<h1>{hotelContent.name}</h1>
<p>{hotelContent.description}</p>
```

## Content Guidelines

⚠️ **IMPORTANT**: This content is based on factual information from the official website. Do NOT:
- Add assumptions or unverified claims
- Modify with fictional information
- Exaggerate features or services
- Reference UI/design elements

✅ **DO**:
- Use the content as-is for marketing materials
- Reference specific sections for different use cases
- Maintain factual accuracy
- Keep professional, warm, and inviting tone

## Content Sources

All content is extracted from:
- Official website: https://shivashraybanaras.com/
- Verified hotel information
- Actual amenities and services
- Real contact information

## Updates

When updating content:
1. Verify information on the official website
2. Update `hotel-content.ts` with new factual information
3. Test components that use the content
4. Ensure consistency across all marketing channels
