/**
 * Product Naming System for Skipaman Brand
 * Generates unique brand names based on color and product style
 */

export interface ProductStyle {
  type: 'tshirt' | 'hoodie' | 'longsleeve' | 'tank' | 'polo' | 'sweater' | 'jacket' | 'flannel';
  category?: string;
}

export interface ColorInfo {
  name: string;
  value: string;
}

// Color name mappings to creative brand names
const colorNameMap: Record<string, string[]> = {
  // Blue variations
  'Blue': ['Blues', 'Blue Wave', 'Blue Horizon', 'Blue Sky'],
  'Navy': ['Navy', 'Navy Deep', 'Ocean Navy', 'Midnight Navy'],
  'Navy Blue': ['Navy Blues', 'Deep Navy', 'Ocean Blue'],
  'Sky Blue': ['Sky Blues', 'Sky Horizon', 'Cloud Blue'],
  'Ocean Blue': ['Ocean Blues', 'Deep Ocean', 'Sea Blue'],
  'Sport Blue': ['Sport Blues', 'Athletic Blue', 'Active Blue'],
  'Electric Blue': ['Electric Blues', 'Electric Wave', 'Neon Blue'],
  'Digital Blue': ['Digital Blues', 'Tech Blue', 'Cyber Blue'],
  'Power Blue': ['Power Blues', 'Energy Blue', 'Strength Blue'],
  'Arcade Blue': ['Arcade Blues', 'Game Blue', 'Pixel Blue'],
  'Team Blue': ['Team Blues', 'Squad Blue', 'Crew Blue'],
  'Classic Blue': ['Classic Blues', 'Vintage Blue', 'Retro Blue'],
  
  // White variations
  'White': ['White Box', 'White Canvas', 'White Cloud', 'Pure White'],
  'Gallery White': ['White Gallery', 'Gallery Box', 'Art White'],
  'Corporate White': ['White Corporate', 'Business White', 'Office White'],
  'Summer White': ['White Summer', 'Summer Box', 'Bright White'],
  'Canvas White': ['White Canvas', 'Canvas Box', 'Art Canvas'],
  'Text White': ['White Text', 'Text Box', 'Minimal White'],
  'Cream': ['Cream Box', 'Ivory', 'Vanilla', 'Soft Cream'],
  'Natural Beige': ['Beige Box', 'Natural', 'Sand'],
  
  // Black variations
  'Black': ['Black', 'Midnight', 'Shadow', 'Onyx'],
  'Hoodie Black': ['Black Hood', 'Midnight Hood', 'Shadow Hood'],
  'Artist Black': ['Black Artist', 'Art Black', 'Gallery Black'],
  'Street Black': ['Black Street', 'Urban Black', 'City Black'],
  'Athletic Black': ['Black Athletic', 'Sport Black', 'Active Black'],
  'Festival Black': ['Black Festival', 'Festival Night', 'Party Black'],
  'Quote Black': ['Black Quote', 'Text Black', 'Minimal Black'],
  'Tech Black': ['Black Tech', 'Digital Black', 'Cyber Black'],
  'Gym Black': ['Black Gym', 'Fitness Black', 'Workout Black'],
  'Space Black': ['Black Space', 'Cosmic Black', 'Galaxy Black'],
  'Espresso Black': ['Black Espresso', 'Coffee Black', 'Mocha'],
  'Vintage Black': ['Black Vintage', 'Retro Black', 'Classic Black'],
  'Classic Black': ['Black Classic', 'Timeless Black', 'Essential Black'],
  'Pixel Black': ['Black Pixel', 'Game Black', 'Arcade Black'],
  'Adventure Black': ['Black Adventure', 'Explorer Black', 'Journey Black'],
  
  // Gray variations
  'Gray': ['Gray', 'Steel', 'Slate', 'Ash'],
  'Light Gray': ['Light Gray', 'Silver', 'Pale Gray', 'Soft Gray'],
  'Heather Gray': ['Heather', 'Heather Gray', 'Soft Heather'],
  'Charcoal': ['Charcoal', 'Charcoal Gray', 'Dark Steel'],
  'Slate Gray': ['Slate', 'Slate Gray', 'Stone Gray'],
  'Concrete Gray': ['Concrete', 'Urban Gray', 'City Gray'],
  'Executive Gray': ['Executive', 'Business Gray', 'Corporate Gray'],
  'Minimal Gray': ['Minimal Gray', 'Simple Gray', 'Clean Gray'],
  'Gym Gray': ['Gym Gray', 'Athletic Gray', 'Sport Gray'],
  'Athletic Gray': ['Athletic Gray', 'Active Gray', 'Performance Gray'],
  'Hoodie Gray': ['Gray Hood', 'Steel Hood', 'Slate Hood'],
  'Fur Gray': ['Fur Gray', 'Soft Gray', 'Warm Gray'],
  'Star Silver': ['Silver Star', 'Stellar Silver', 'Cosmic Silver'],
  'Charcoal Gray': ['Charcoal', 'Deep Charcoal', 'Rich Charcoal'],
  
  // Red variations
  'Maroon': ['Maroon', 'Burgundy', 'Wine', 'Deep Red'],
  'Burgundy': ['Burgundy', 'Wine Red', 'Deep Burgundy'],
  'Energy Red': ['Red Energy', 'Energy Wave', 'Power Red'],
  'Team Red': ['Red Team', 'Team Fire', 'Squad Red'],
  'Red Plaid': ['Plaid Red', 'Red Check', 'Classic Plaid'],
  'Energy Orange': ['Orange Energy', 'Energy Burst', 'Vibrant Orange'],
  
  // Orange variations
  'Orange': ['Orange', 'Sunset', 'Amber', 'Tangerine'],
  'Sunset Orange': ['Orange Sunset', 'Sunset Wave', 'Golden Hour'],
  'Energy Orange': ['Orange Energy', 'Energy Burst', 'Power Orange'],
  
  // Green variations
  'Green': ['Green', 'Forest', 'Emerald', 'Jade'],
  'Earth Green': ['Earth Green', 'Natural Green', 'Organic Green'],
  'Olive Green': ['Olive', 'Olive Green', 'Army Green'],
  'Forest Green': ['Forest', 'Forest Green', 'Woodland'],
  'Adventure Green': ['Adventure Green', 'Explorer Green', 'Wild Green'],
  'Palm Green': ['Palm Green', 'Tropical Green', 'Island Green'],
  'Circuit Green': ['Circuit Green', 'Tech Green', 'Digital Green'],
  'Team Green': ['Team Green', 'Squad Green', 'Crew Green'],
  'Green Plaid': ['Plaid Green', 'Green Check', 'Forest Plaid'],
  
  // Purple variations
  'Purple': ['Purple', 'Violet', 'Lavender', 'Plum'],
  'Galaxy Purple': ['Purple Galaxy', 'Galaxy Wave', 'Cosmic Purple'],
  'Royal Purple': ['Royal Purple', 'Purple Royal', 'Regal Purple'],
  'Deep Purple': ['Deep Purple', 'Purple Deep', 'Rich Purple'],
  'Vibrant Purple': ['Vibrant Purple', 'Purple Vibrant', 'Bold Purple'],
  'Neon Pink': ['Neon Pink', 'Pink Neon', 'Electric Pink'],
  
  // Brown variations
  'Brown': ['Brown', 'Coffee', 'Mocha', 'Chocolate'],
  'Coffee Brown': ['Coffee', 'Coffee Bean', 'Espresso'],
  'Explorer Brown': ['Brown Explorer', 'Adventure Brown', 'Earth Brown'],
  'Earth Brown': ['Earth', 'Earth Brown', 'Natural Brown'],
  'Animal Brown': ['Animal Brown', 'Fur Brown', 'Natural Brown'],
  
  // Pink variations
  'Pink': ['Pink', 'Rose', 'Blush', 'Coral'],
  'Coral Pink': ['Coral', 'Coral Pink', 'Sunset Pink'],
  'Pet Pink': ['Pet Pink', 'Soft Pink', 'Gentle Pink'],
  
  // Yellow/Gold variations
  'Yellow': ['Yellow', 'Sunshine', 'Gold', 'Amber'],
  
  // Other colors
  'Red': ['Red', 'Crimson', 'Scarlet', 'Fire'],
  'Red Plaid': ['Plaid Red', 'Red Check', 'Classic Plaid'],
};

// Style name mappings
const styleNameMap: Record<string, string> = {
  'tshirt': '',
  'longsleeve': 'Long Sleeve',
  'tank': 'Tank',
  'polo': 'Polo',
  'hoodie': 'Hood',
  'sweater': 'Sweater',
  'jacket': 'Jacket',
  'flannel': 'Flannel',
};

// Category-based style modifiers
const categoryStyleMap: Record<string, string> = {
  'graphic': '',
  'minimalist': 'Minimal',
  'vintage': 'Vintage',
  'athletic': 'Athletic',
  'streetwear': 'Street',
  'business': 'Business',
  'eco': 'Eco',
  'premium': 'Premium',
  'limited': 'Limited',
  'festival': 'Festival',
  'travel': 'Travel',
  'sports': 'Sports',
  'nature': 'Nature',
  'tech': 'Tech',
  'artistic': 'Artistic',
  'summer': 'Summer',
  'winter': 'Winter',
  'fitness': 'Fitness',
  'lifestyle': 'Lifestyle',
  'space': 'Space',
  'pets': 'Pet',
  'statement': 'Statement',
};

/**
 * Gets the primary color name from a color object
 */
function getPrimaryColorName(color: ColorInfo): string {
  return color.name;
}

/**
 * Gets the product style type from category and name
 */
function getProductStyle(productName: string, category: string): ProductStyle {
  const nameLower = productName.toLowerCase();
  const categoryLower = category.toLowerCase();
  
  if (nameLower.includes('hoodie') || nameLower.includes('hoody') || categoryLower === 'hoodies') {
    return { type: 'hoodie', category };
  }
  if (nameLower.includes('long sleeve') || nameLower.includes('longsleeve')) {
    return { type: 'longsleeve', category };
  }
  if (nameLower.includes('tank')) {
    return { type: 'tank', category };
  }
  if (nameLower.includes('polo')) {
    return { type: 'polo', category };
  }
  if (nameLower.includes('sweater')) {
    return { type: 'sweater', category };
  }
  if (nameLower.includes('jacket')) {
    return { type: 'jacket', category };
  }
  if (nameLower.includes('flannel')) {
    return { type: 'flannel', category };
  }
  
  return { type: 'tshirt', category };
}

/**
 * Generates a brand name for a product based on its primary color and style
 */
export function generateBrandName(
  productName: string,
  category: string,
  colors: ColorInfo[]
): string {
  if (colors.length === 0) {
    return `Skipaman ${productName}`;
  }
  
  // Use the first color as the primary color
  const primaryColor = colors[0];
  const colorName = getPrimaryColorName(primaryColor);
  const style = getProductStyle(productName, category);
  
  // Get color variations
  const colorVariations = colorNameMap[colorName] || [colorName];
  const colorBrand = colorVariations[0]; // Use first variation
  
  // Get style suffix
  const styleSuffix = styleNameMap[style.type] || '';
  
  // Get category modifier
  const categoryModifier = categoryStyleMap[category] || '';
  
  // Build the brand name
  let brandName = 'Skipaman';
  
  // Add category modifier if it exists and adds value
  if (categoryModifier && style.type === 'tshirt') {
    brandName += ` ${categoryModifier}`;
  }
  
  // Add color
  brandName += ` ${colorBrand}`;
  
  // Add style suffix
  if (styleSuffix) {
    brandName += ` ${styleSuffix}`;
  }
  
  // Special cases for specific patterns
  if (colorName.toLowerCase() === 'white' && style.type === 'tshirt') {
    brandName = 'Skipaman White Box';
  } else if (colorName.toLowerCase().includes('orange') && style.type === 'longsleeve') {
    brandName = 'Skipaman Orange Log Sleeve';
  } else if (colorName.toLowerCase().includes('blue') && style.type === 'tshirt') {
    brandName = 'Skipaman Blues';
  }
  
  return brandName.trim();
}

/**
 * Generates brand names for all color variations of a product
 */
export function generateBrandNamesForAllColors(
  productName: string,
  category: string,
  colors: ColorInfo[]
): string[] {
  return colors.map((color, index) => {
    if (index === 0) {
      // Primary color uses the main brand name
      return generateBrandName(productName, category, [color]);
    } else {
      // Additional colors get their own variation
      const style = getProductStyle(productName, category);
      const colorVariations = colorNameMap[color.name] || [color.name];
      const colorBrand = colorVariations[0];
      const styleSuffix = styleNameMap[style.type] || '';
      
      let variantName = `Skipaman ${colorBrand}`;
      if (styleSuffix) {
        variantName += ` ${styleSuffix}`;
      }
      
      return variantName.trim();
    }
  });
}












