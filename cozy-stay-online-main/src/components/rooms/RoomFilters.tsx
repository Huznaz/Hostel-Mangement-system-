
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface FilterValues {
  priceRange: [number, number];
  capacity: number;
  breakfast: boolean;
  pets: boolean;
}

interface RoomFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

// Update these constants for clarity & consistency
const MIN_PRICE = 2200;
const MAX_PRICE = 8500;
const DEFAULT_PRICE_RANGE: [number, number] = [MIN_PRICE, MAX_PRICE];

const RoomFilters = ({ onFilterChange }: RoomFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [capacity, setCapacity] = useState<number>(1);
  const [breakfast, setBreakfast] = useState<boolean>(false);
  const [pets, setPets] = useState<boolean>(false);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleCapacityChange = (value: number) => {
    setCapacity(value);
  };

  const handleBreakfastChange = (checked: boolean) => {
    setBreakfast(checked);
  };

  const handlePetsChange = (checked: boolean) => {
    setPets(checked);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      capacity,
      breakfast,
      pets
    });
  };

  const handleResetFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setCapacity(1);
    setBreakfast(false);
    setPets(false);

    onFilterChange({
      priceRange: DEFAULT_PRICE_RANGE,
      capacity: 1,
      breakfast: false,
      pets: false
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif font-semibold mb-6">Filter Rooms</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider 
          defaultValue={DEFAULT_PRICE_RANGE}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={100}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>KSH {priceRange[0]}</span>
          <span>KSH {priceRange[1]}</span>
        </div>
      </div>
      
      {/* Capacity */}
      <div className="mb-6">
        <h4 className="font-medium mb-4">Guests</h4>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map(num => (
            <Button 
              key={num} 
              variant={capacity === num ? "default" : "outline"} 
              className={capacity === num ? "bg-hotel-gold hover:bg-amber-600" : ""}
              size="sm"
              onClick={() => handleCapacityChange(num)}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Additional Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="breakfast" 
            checked={breakfast}
            onCheckedChange={(checked) => handleBreakfastChange(checked as boolean)}
          />
          <Label htmlFor="breakfast" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Breakfast Included
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pets" 
            checked={pets}
            onCheckedChange={(checked) => handlePetsChange(checked as boolean)}
          />
          <Label htmlFor="pets" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Pets Allowed
          </Label>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={handleApplyFilters}
          className="bg-hotel-gold hover:bg-amber-600 text-white"
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default RoomFilters;
