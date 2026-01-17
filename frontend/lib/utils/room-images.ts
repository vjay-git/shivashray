/**
 * Utility functions for mapping room types to images
 */

export const getRoomTypeImage = (roomTypeName: string, index: number = 0): string => {
  const name = roomTypeName.toLowerCase();
  
  // Map room type names to images
  if (name.includes('double') || name.includes('standard')) {
    return '/double_room.jpg';
  }
  if (name.includes('deluxe')) {
    return '/deluxe_Room.jpg';
  }
  if (name.includes('spacious') || name.includes('suite')) {
    return '/spacious_room.png';
  }
  
  // Fallback to numbered room images
  const roomImages = [
    '/room1.jpg',
    '/room2.jpg',
    '/room3.jpg',
    '/room4.jpg',
    '/room5.jpg',
    '/room6.jpg',
    '/room7.jpg',
    '/room9.png',
  ];
  
  return roomImages[index % roomImages.length];
};

export const getAllRoomImages = (): string[] => {
  return [
    '/double_room.jpg',
    '/deluxe_Room.jpg',
    '/spacious_room.png',
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
