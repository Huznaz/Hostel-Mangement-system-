
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PRICE_MIN, PRICE_MAX } from '@/data/hostelData';

export interface FilterValues {
  priceRange: [number, number];
  capacity: number;
  breakfast: boolean;
  pets: boolean;
}

interface RoomFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const DEFAULT_PRICE_RANGE: [number, number] = [PRICE_MIN, PRICE_MAX];

const RoomFilters = ({ onFilterChange }: RoomFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [capacity, setCapacity] = useState<number>(1);
  const [mealsPlan, setMealsPlan] = useState<boolean>(false);
  const [privateBathroom, setPrivateBathroom] = useState<boolean>(false);

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      capacity,
      breakfast: mealsPlan,
      pets: privateBathroom,
    });
  };

  const handleResetFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setCapacity(1);
    setMealsPlan(false);
    setPrivateBathroom(false);

    onFilterChange({
      priceRange: DEFAULT_PRICE_RANGE,
      capacity: 1,
      breakfast: false,
      pets: false,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif font-semibold mb-6">Filter Rooms</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Monthly Rent (KSH)</h4>
        <Slider 
          defaultValue={DEFAULT_PRICE_RANGE}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>KSH {priceRange[0]}</span>
          <span>KSH {priceRange[1]}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-4">Occupants</h4>
        <div className="flex items-center space-x-2">
          {[1, 2].map(num => (
            <Button 
              key={num} 
              variant={capacity === num ? "default" : "outline"} 
              className={capacity === num ? "bg-hotel-gold hover:bg-amber-600" : ""}
              size="sm"
              onClick={() => setCapacity(num)}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="meals" 
            checked={mealsPlan}
            onCheckedChange={(checked) => setMealsPlan(checked as boolean)}
          />
          <Label htmlFor="meals">Meals plan included</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bathroom" 
            checked={privateBathroom}
            onCheckedChange={(checked) => setPrivateBathroom(checked as boolean)}
          />
          <Label htmlFor="bathroom">Private bathroom</Label>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={handleApplyFilters}
          className="bg-hotel-gold hover:bg-amber-600 text-white"
        >
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default RoomFilters;
