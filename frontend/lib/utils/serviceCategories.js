export const SERVICE_CATEGORIES = [
  {
    name: 'Home Services',
    subcategories: [
      'Electrician',
      'Plumber',
      'Carpenter',
      'Painter',
      'AC Repair & Service',
      'RO/Water Purifier Service',
      'CCTV Installation',
      'Home Cleaning',
      'Pest Control',
      'Interior Designer',
      'Tiles & Marble Work',
      'Furniture Repair',
      'Glass & Aluminum Work',
      'Welding Services',
    ],
  },
  {
    name: 'Education Services',
    subcategories: [
      'Home Tutor',
      'Coaching Center',
      'Spoken English Classes',
      'Computer Training',
      'Dance Classes',
      'Music Classes',
      'Online Tuition',
      'Competitive Exam Coaching',
    ],
  },
  {
    name: 'Beauty & Personal Care',
    subcategories: [
      'Salon',
      'Barber Shop',
      'Beauty Parlour',
      'Makeup Artist',
      'Mehendi Artist',
      'Spa & Massage',
      'Skin Care Clinic',
      'Nail Art Studio',
    ],
  },
  {
    name: 'Health & Medical',
    subcategories: [
      'Hospital',
      'Clinic',
      'Dentist',
      'Pathology Lab',
      'Pharmacy / Medical Store',
      'Physiotherapist',
      'Ambulance Service',
      'Veterinary Doctor',
      'Home Nursing',
    ],
  },
  {
    name: 'Food & Restaurant',
    subcategories: [
      'Restaurant',
      'Cafe',
      'Bakery',
      'Sweet Shop',
      'Fast Food Center',
      'Catering Service',
      'Tiffin Service',
      'Juice Corner',
      'Tea Stall',
    ],
  },
  {
    name: 'Repair & Technical Services',
    subcategories: [
      'Mobile Repair',
      'Laptop Repair',
      'TV Repair',
      'Refrigerator Repair',
      'Washing Machine Repair',
      'Printer Repair',
      'Internet/WiFi Service',
      'Software Installation',
    ],
  },
  {
    name: 'Automotive & Vehicles',
    subcategories: [
      'Car Service Center',
      'Bike Repair',
      'Tractor Repair',
      'Commercial Vehicle Repair',
      'Car Parts Store',
      'Bike Parts Store',
      'Tractor Parts Store',
      'Used Car Dealer',
      'Used Bike Dealer',
      'Car Wash & Detailing',
      'Tyre & Battery Shop',
      'Petrol Pump',
      'EV Charging Station',
      'Towing Service',
      'Driving School',
    ],
  },
  {
    name: 'Shopping & Retail',
    subcategories: [
      'Grocery Store',
      'Clothing Shop',
      'Shoe Store',
      'Gift Shop',
      'Mobile Shop',
      'Electronics Store',
      'Furniture Store',
      'Book Store',
      'Jewellery Shop',
    ],
  },
  {
    name: 'Event & Wedding Services',
    subcategories: [
      'Wedding Planner',
      'Photographer',
      'Videographer',
      'DJ Sound Service',
      'Tent House',
      'Decoration Service',
      'Banquet Hall',
      'Caterer',
      'Bridal Makeup',
    ],
  },
  {
    name: 'Real Estate & Property',
    subcategories: [
      'Property Dealer',
      'Rental Service',
      'PG & Hostel',
      'Construction Contractor',
      'Building Material Supplier',
      'Architect',
      'Home Loan Consultant',
    ],
  },
  {
    name: 'Daily Need Services',
    subcategories: [
      'Laundry Service',
      'Courier Service',
      'Milk Delivery',
      'Gas Delivery',
      'Drinking Water Supplier',
      'Garbage Pickup',
      'Newspaper Delivery',
    ],
  },
  {
    name: 'Digital & Online Services',
    subcategories: [
      'Website Development',
      'Graphic Designer',
      'Digital Marketing',
      'SEO Service',
      'Video Editing',
      'Social Media Manager',
      'Printing & Flex Banner',
      'Cyber Cafe',
    ],
  },
  {
    name: 'Agriculture & Rural Services',
    subcategories: [
      'Seed Store',
      'Fertilizer Shop',
      'Tractor Rental',
      'Poultry Farm',
      'Dairy Farm',
      'Animal Feed Shop',
      'Irrigation Service',
    ],
  },
  {
    name: 'Religious & Spiritual',
    subcategories: [
      'Pandit Booking',
      'Temple Service',
      'Astrology',
      'Vastu Consultant',
      'पूजा सामग्री Shop',
    ],
  },
  {
    name: 'Emergency Services',
    subcategories: [
      'Ambulance',
      'Blood Bank',
      'Fire Service',
      'Locksmith',
      'Emergency Electrician',
      'Emergency Plumber',
    ],
  },
  {
    name: 'Professional Services',
    subcategories: [
      'CA / Accountant',
      'Lawyer',
      'Insurance Agent',
      'Loan Consultant',
      'Travel Agent',
      'Visa Consultant',
    ],
  },
]

export const slugifyService = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const findServiceCategoryBySlug = (slug) =>
  SERVICE_CATEGORIES.find((category) => slugifyService(category.name) === slug)

export const getSubcategoriesForCategory = (categoryName) =>
  SERVICE_CATEGORIES.find((category) => category.name.toLowerCase() === String(categoryName).toLowerCase())?.subcategories || []

export function mergeServiceCategories(extraCategories = []) {
  const byName = new Map()

  const addCategory = (category) => {
    const name = String(category?.name || '').trim()
    if (!name) return

    const key = name.toLowerCase()
    const existing = byName.get(key) || { name, subcategories: [] }
    const seenSubcategories = new Set(existing.subcategories.map((subcategory) => subcategory.toLowerCase()))

    for (const subcategoryValue of category.subcategories || []) {
      const subcategory = String(subcategoryValue || '').trim()
      if (!subcategory) continue

      const subcategoryKey = subcategory.toLowerCase()
      if (!seenSubcategories.has(subcategoryKey)) {
        existing.subcategories.push(subcategory)
        seenSubcategories.add(subcategoryKey)
      }
    }

    byName.set(key, existing)
  }

  SERVICE_CATEGORIES.forEach(addCategory)
  extraCategories.forEach(addCategory)

  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name))
}
