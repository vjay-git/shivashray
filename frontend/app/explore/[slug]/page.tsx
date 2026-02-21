import type { Metadata } from 'next';
import { getPlaceBySlug } from '@/lib/data/places';
import { PlaceDetailClient } from './PlaceDetailClient';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return { title: 'Place Not Found' };

  const desc = place.content.introduction.slice(0, 158);
  const img  = place.imageUrl ?? '/kashi_temple.jpg';

  return {
    title: place.name,
    description: desc,
    openGraph: {
      title: `${place.name} — Shiv Ashray Varanasi`,
      description: desc,
      images: [{ url: img, width: 1200, height: 630, alt: place.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name} — Shiv Ashray Varanasi`,
      description: desc,
      images: [img],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PlaceDetailClient slug={slug} />;
}
