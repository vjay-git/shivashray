import { Place, PlaceCategory } from '@/types';

export const places: Place[] = [
  {
    id: 'kashi-vishwanath-temple',
    slug: 'kashi-vishwanath-temple',
    name: 'Kashi Vishwanath Temple',
    description: 'The spiritual heart of Varanasi, where ancient devotion meets timeless architecture.',
    category: 'sacred-temples',
    distance: '2.5 km',
    travelHint: 'A short walk or auto-rickshaw ride from the hotel',
    imageUrl: '/lordshiva.jpg',
    content: {
      introduction: 'Kashi Vishwanath Temple stands as one of the most revered shrines in Hinduism, dedicated to Lord Shiva. The temple has been a center of spiritual energy for thousands of years, drawing pilgrims from across the world.',
      culturalContext: 'The temple complex represents centuries of architectural evolution, with the current structure dating back to the 18th century. The golden spire, or shikhara, rises majestically above the Ganges, visible from across the river.',
      spiritualContext: 'Believed to be one of the twelve Jyotirlingas, this temple holds profound significance in Hindu mythology. Devotees believe that a visit here and a dip in the Ganges can lead to moksha, liberation from the cycle of rebirth.',
      howToReach: 'The temple is easily accessible from the hotel. You can walk through the narrow lanes of Varanasi, take an auto-rickshaw, or use a cycle rickshaw for a more traditional experience. The journey itself through the old city is part of the spiritual experience.'
    }
  },
  {
    id: 'dashashwamedh-ghat',
    slug: 'dashashwamedh-ghat',
    name: 'Dashashwamedh Ghat',
    description: 'Where the Ganges comes alive with evening aarti, a symphony of light, sound, and devotion.',
    category: 'cultural-landmarks',
    distance: '3 km',
    travelHint: 'Best visited during evening aarti, accessible by boat or walk',
    imageUrl: '/lordshiva1.jpg',
    content: {
      introduction: 'Dashashwamedh Ghat is one of the oldest and most vibrant ghats in Varanasi. According to legend, Lord Brahma performed ten horse sacrifices here, giving the ghat its name.',
      culturalContext: 'The ghat serves as a cultural hub where daily life, spirituality, and tradition converge. Every evening, the Ganga Aarti ceremony transforms the space into a mesmerizing spectacle of fire, bells, and chants.',
      howToReach: 'You can reach Dashashwamedh Ghat by walking through the old city lanes, or take a boat ride along the Ganges. The evening aarti begins around sunset and is best experienced from a boat or from the ghat steps.'
    }
  },
  {
    id: 'sarnath',
    slug: 'sarnath',
    name: 'Sarnath',
    description: 'Where the Buddha delivered his first sermon, a place of profound peace and historical significance.',
    category: 'sacred-temples',
    distance: '10 km',
    travelHint: 'A 20-minute drive from the hotel',
    imageUrl: '/lordshiva2.jpg',
    content: {
      introduction: 'Sarnath is one of the four most important Buddhist pilgrimage sites in the world. It was here, in the Deer Park, that the Buddha gave his first sermon after attaining enlightenment.',
      culturalContext: 'The site contains ancient stupas, monasteries, and the famous Ashoka Pillar. The Dhamek Stupa stands as a testament to centuries of Buddhist architecture and devotion.',
      spiritualContext: 'For Buddhists, Sarnath represents the turning of the wheel of Dharma. The peaceful atmosphere and well-preserved ruins offer a contemplative space for reflection and meditation.',
      howToReach: 'Sarnath is approximately 10 kilometers from the hotel. You can hire a taxi or auto-rickshaw for the journey. The site is open throughout the day, and early morning visits offer the most serene experience.'
    }
  },
  {
    id: 'assi-ghat',
    slug: 'assi-ghat',
    name: 'Assi Ghat',
    description: 'The southernmost ghat, where the Assi River meets the Ganges, offering quiet moments of reflection.',
    category: 'nature-scenic',
    distance: '4 km',
    travelHint: 'A peaceful morning walk or cycle rickshaw ride',
    imageUrl: '/lordshiva.jpg',
    content: {
      introduction: 'Assi Ghat marks the confluence of the Assi River with the Ganges. It is the southernmost ghat and offers a more tranquil atmosphere compared to the central ghats.',
      culturalContext: 'The ghat is popular among locals and visitors seeking a quieter experience. It hosts morning yoga sessions and is a favorite spot for sunrise views over the Ganges.',
      howToReach: 'Assi Ghat is accessible by walking along the riverfront or taking a cycle rickshaw. Early morning visits offer the best experience, with fewer crowds and beautiful light over the river.'
    }
  },
  {
    id: 'tulsi-manas-temple',
    slug: 'tulsi-manas-temple',
    name: 'Tulsi Manas Temple',
    description: 'A modern temple where the Ramayana is inscribed on its walls, celebrating devotion through poetry.',
    category: 'sacred-temples',
    distance: '3 km',
    travelHint: 'A short drive or walk from the hotel',
    imageUrl: '/lordshiva1.jpg',
    content: {
      introduction: 'Tulsi Manas Temple is dedicated to Lord Rama and is built at the site where Tulsidas wrote the Ramcharitmanas, the Hindi version of the Ramayana.',
      culturalContext: 'The temple walls are inscribed with verses from the Ramcharitmanas, making it a unique blend of architecture and literature. The white marble structure stands in beautiful contrast to the surrounding area.',
      spiritualContext: 'The temple honors the devotion of Tulsidas and the power of storytelling in preserving spiritual wisdom. It serves as a reminder of how ancient epics continue to inspire millions.',
      howToReach: 'The temple is located near Durga Temple and is easily accessible by auto-rickshaw or a pleasant walk through the old city.'
    }
  },
  {
    id: 'banaras-hindu-university',
    slug: 'banaras-hindu-university',
    name: 'Banaras Hindu University',
    description: 'A center of learning and culture, where modern education meets ancient wisdom.',
    category: 'cultural-landmarks',
    distance: '8 km',
    travelHint: 'A 15-minute drive, best visited during morning hours',
    imageUrl: '/lordshiva2.jpg',
    content: {
      introduction: 'Banaras Hindu University, founded in 1916, is one of Asia\'s largest residential universities. The campus spans over 1,300 acres and houses numerous temples, museums, and academic buildings.',
      culturalContext: 'The university campus includes the Bharat Kala Bhavan museum, which houses an impressive collection of Indian art, and the Vishwanath Temple, a modern architectural marvel.',
      howToReach: 'BHU is located in the southern part of Varanasi. You can reach it by taxi or auto-rickshaw. The campus is open to visitors, and guided tours are available.'
    }
  },
  {
    id: 'ramnagar-fort',
    slug: 'ramnagar-fort',
    name: 'Ramnagar Fort',
    description: 'A riverside fort that houses a museum of royal artifacts, overlooking the Ganges with timeless grace.',
    category: 'cultural-landmarks',
    distance: '14 km',
    travelHint: 'A 30-minute drive, or take a boat ride along the Ganges',
    imageUrl: '/lordshiva.jpg',
    content: {
      introduction: 'Ramnagar Fort, built in the 18th century, stands on the eastern bank of the Ganges. It serves as the residence of the Maharaja of Banaras and houses a museum with royal collections.',
      culturalContext: 'The fort museum displays vintage cars, royal palanquins, weapons, and an impressive collection of manuscripts. The architecture reflects the Mughal style with intricate carvings and courtyards.',
      howToReach: 'Ramnagar Fort is accessible by road or by taking a boat ride across the Ganges. The journey by boat offers beautiful views of the river and the city skyline.'
    }
  },
  {
    id: 'chunar-fort',
    slug: 'chunar-fort',
    name: 'Chunar Fort',
    description: 'A historic fort with panoramic views, where history whispers through ancient walls.',
    category: 'short-excursions',
    distance: '35 km',
    travelHint: 'A day trip, approximately 1 hour drive',
    imageUrl: '/lordshiva1.jpg',
    content: {
      introduction: 'Chunar Fort, located on the banks of the Ganges, has witnessed over two millennia of history. The fort has been occupied by various dynasties and offers stunning views of the surrounding landscape.',
      culturalContext: 'The fort complex includes ancient temples, a stepwell, and remnants of different architectural periods. The location provides a peaceful retreat from the city.',
      howToReach: 'Chunar Fort is best visited as a day trip. You can hire a taxi for the journey. The drive takes you through rural landscapes, and the fort itself requires some walking to explore fully.'
    }
  }
];

export function getPlaceBySlug(slug: string): Place | undefined {
  return places.find(place => place.slug === slug);
}

export function getPlacesByCategory(category?: PlaceCategory): Place[] {
  if (!category) return places;
  return places.filter(place => place.category === category);
}

export const categories = [
  { id: 'sacred-temples', label: 'Sacred Temples', description: 'Places of worship and spiritual significance' },
  { id: 'nature-scenic', label: 'Nature & Scenic Views', description: 'Natural beauty and peaceful landscapes' },
  { id: 'cultural-landmarks', label: 'Cultural Landmarks', description: 'Historical and cultural sites' },
  { id: 'short-excursions', label: 'Short Excursions', description: 'Day trips and nearby destinations' }
] as const;
