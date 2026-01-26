/**
 * Utility functions for mapping room types to images
 * Uses images directly from shivashray_images folders
 */

/**
 * Get all images for a specific room type
 */
export const getRoomTypeImages = (roomTypeName: string): string[] => {
  const name = roomTypeName.toLowerCase();
  
  // Map room type names to images from shivashray_images folders
  // Handles: "Deluxe", "Deluxe Room" → Deluxe Room folder
  if (name.includes('deluxe') && !name.includes('super')) {
    // Deluxe Room images
    return [
      '/shivashray_images/Deluxe Room/0b22cd3c-8f17-4eb0-b035-dc515222ee7a.jpg',
      '/shivashray_images/Deluxe Room/5fd70227-d605-4c8a-a5b1-0b184bca0875.jpg',
      '/shivashray_images/Deluxe Room/7c3842d8-4894-46f0-a613-d23d0ec9d04d.jpg',
      '/shivashray_images/Deluxe Room/80cf6207-8641-4a50-828a-51c1d2025879.jpg',
      '/shivashray_images/Deluxe Room/89ba8bcf-779c-4b64-99ee-5a85918d5a43.jpg',
      '/shivashray_images/Deluxe Room/bdc6f12d-a7d6-49a2-8e3c-2fdb2621f5c2.jpg',
      '/shivashray_images/Deluxe Room/bf133f04-2360-42af-8aa5-e244af266397.jpg',
      '/shivashray_images/Deluxe Room/c222b3ad-c33d-4aba-a571-b9cd85065975.jpg',
      '/shivashray_images/Deluxe Room/d9447051-2dea-4d74-a25a-046b2c2a05d1.jpg',
      '/shivashray_images/Deluxe Room/d9875c87-3c14-4dc4-b148-638ebe219145.jpg',
    ];
  }
  
  // Handles: "Super Deluxe", "Super Deluxe Room", "Suite" → Super Deluxe Room folder
  if (name.includes('super') || name.includes('suite')) {
    // Super Deluxe Room / Suite images
    return [
      '/shivashray_images/Super Deluxe Room/66de74a8-c3ad-4a98-b49d-9e331e4eacfc.jpg',
      '/shivashray_images/Super Deluxe Room/63e98d7a-cc99-46c8-bf34-639f2e82cf22.jpg',
      '/shivashray_images/Super Deluxe Room/64a92319-19b5-4756-afba-9c96fd38f461.avif',
      '/shivashray_images/Super Deluxe Room/14667271-51f9-4428-8dce-66f4164c68c4.jpg',
      '/shivashray_images/Super Deluxe Room/a0870948-f8d6-4c25-a834-a8d5615cee38.jpg',
      '/shivashray_images/Super Deluxe Room/WhatsApp Image 2025-09-19 at 16.20.15_9b75fed0.jpg',
    ];
  }
  
  // Handles: "Family", "Family Room", "Standard" → Family Room folder
  if (name.includes('family') || name.includes('standard')) {
    // Family Room / Standard images
    return [
      '/shivashray_images/Family Room/e87a107d-3ead-4bca-b6a5-c6eec45e912f.jpg',
      '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_011504ed.jpg',
      '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_7455891f.jpg',
      '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_921534a8.jpg',
    ];
  }
  
  // Fallback to property images or old room images
  return [
    '/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_95a4b82b.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_ad50538d.jpg',
    '/room1.jpg',
    '/room2.jpg',
    '/room3.jpg',
    '/room4.jpg',
    '/room5.jpg',
    '/room6.jpg',
    '/room7.jpg',
    '/room9.png',
  ];
};

export const getRoomTypeImage = (roomTypeName: string, index: number = 0): string => {
  const images = getRoomTypeImages(roomTypeName);
  return images[index % images.length];
};

export const getAllRoomImages = (): string[] => {
  return [
    // Deluxe Room images
    '/shivashray_images/Deluxe Room/0b22cd3c-8f17-4eb0-b035-dc515222ee7a.jpg',
    '/shivashray_images/Deluxe Room/5fd70227-d605-4c8a-a5b1-0b184bca0875.jpg',
    '/shivashray_images/Deluxe Room/7c3842d8-4894-46f0-a613-d23d0ec9d04d.jpg',
    '/shivashray_images/Deluxe Room/80cf6207-8641-4a50-828a-51c1d2025879.jpg',
    '/shivashray_images/Deluxe Room/89ba8bcf-779c-4b64-99ee-5a85918d5a43.jpg',
    '/shivashray_images/Deluxe Room/bdc6f12d-a7d6-49a2-8e3c-2fdb2621f5c2.jpg',
    '/shivashray_images/Deluxe Room/bf133f04-2360-42af-8aa5-e244af266397.jpg',
    '/shivashray_images/Deluxe Room/c222b3ad-c33d-4aba-a571-b9cd85065975.jpg',
    '/shivashray_images/Deluxe Room/d9447051-2dea-4d74-a25a-046b2c2a05d1.jpg',
    '/shivashray_images/Deluxe Room/d9875c87-3c14-4dc4-b148-638ebe219145.jpg',
    // Super Deluxe Room images
    '/shivashray_images/Super Deluxe Room/66de74a8-c3ad-4a98-b49d-9e331e4eacfc.jpg',
    '/shivashray_images/Super Deluxe Room/63e98d7a-cc99-46c8-bf34-639f2e82cf22.jpg',
    '/shivashray_images/Super Deluxe Room/64a92319-19b5-4756-afba-9c96fd38f461.avif',
    '/shivashray_images/Super Deluxe Room/14667271-51f9-4428-8dce-66f4164c68c4.jpg',
    '/shivashray_images/Super Deluxe Room/a0870948-f8d6-4c25-a834-a8d5615cee38.jpg',
    '/shivashray_images/Super Deluxe Room/WhatsApp Image 2025-09-19 at 16.20.15_9b75fed0.jpg',
    // Family Room images
    '/shivashray_images/Family Room/e87a107d-3ead-4bca-b6a5-c6eec45e912f.jpg',
    '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_011504ed.jpg',
    '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_7455891f.jpg',
    '/shivashray_images/Family Room/WhatsApp Image 2025-09-19 at 16.20.45_921534a8.jpg',
    // Property images
    '/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_95a4b82b.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_ad50538d.jpg',
    // Legacy images (fallback)
    '/room1.jpg',
    '/room2.jpg',
    '/room3.jpg',
    '/room4.jpg',
    '/room5.jpg',
    '/room6.jpg',
    '/room7.jpg',
    '/room9.png',
  ];
};

export const getRoomImageByIndex = (index: number): string => {
  const images = getAllRoomImages();
  return images[index % images.length];
};

/**
 * Get property images for hero/background sections
 */
export const getPropertyImages = (): string[] => {
  return [
    '/shivashray_images/Property Images/713583d6-b231-4eb5-82a8-4bbdcc4791fc.avif',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.14_8319d8cc.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_95a4b82b.jpg',
    '/shivashray_images/Property Images/WhatsApp Image 2025-09-19 at 16.20.16_ad50538d.jpg',
  ];
};
