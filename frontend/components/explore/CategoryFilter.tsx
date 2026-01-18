'use client';

import { PlaceCategory } from '@/types';
import { categories } from '@/lib/data/places';

interface CategoryFilterProps {
  selectedCategory?: PlaceCategory;
  onCategoryChange: (category?: PlaceCategory) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
      <button
        onClick={() => onCategoryChange(undefined)}
        className={`px-6 py-2.5 text-sm md:text-base font-light transition-all duration-300 ${
          !selectedCategory
            ? 'text-foreground border-b-2 border-foreground'
            : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30'
        }`}
        aria-label="Show all places"
      >
        All Places
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id as PlaceCategory)}
          className={`px-6 py-2.5 text-sm md:text-base font-light transition-all duration-300 ${
            selectedCategory === category.id
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30'
          }`}
          aria-label={`Filter by ${category.label}`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
