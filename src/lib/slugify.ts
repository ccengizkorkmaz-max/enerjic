export function slugify(text: string): string {
  const map: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    ' ': '-', '_': '-'
  };

  let str = text.toLowerCase();
  
  // Replace Turkish characters
  for (const key in map) {
    str = str.replaceAll(key, map[key]);
  }

  return str
    .replace(/[^a-z0-9-]/g, '') // remove special chars
    .replace(/-+/g, '-')        // collapse hyphens
    .replace(/^-+|-+$/g, '');   // trim hyphens
}

// Find original city name from dynamic list by checking slugified values
export function getOriginalCityName(slug: string, cities: string[]): string | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return cities.find(city => slugify(city) === cleanSlug);
}

// Find original district name from dynamic list
export function getOriginalDistrictName(slug: string, districts: string[]): string | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return districts.find(dist => slugify(dist) === cleanSlug);
}
