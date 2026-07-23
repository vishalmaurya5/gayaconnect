import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
// Force Turbopack Recompilation
import ExploreCity from '@/lib/db/models/ExploreCity';
import ExplorePlace from '@/lib/db/models/ExplorePlace';
import { gayaPlaces } from '@/lib/data/gayaPlaces';
import { nearbyPlaces } from '@/lib/data/nearbyPlaces';
import { nawadaPlaces } from '@/lib/data/nawadaPlaces';
import { nawadaNearbyPlaces } from '@/lib/data/nawadaNearbyPlaces';

export async function GET(request) {
  try {
    await connectDB();

    // Check if cities exist in DB, if not, auto-seed default cities and places
    let cities = await ExploreCity.find({}).sort({ displayOrder: 1, createdAt: 1 });

    if (!cities || cities.length === 0) {
      // Seed Cities
      const seedCities = [
        { cityId: 'gaya', name: 'Gaya', state: 'Bihar', desc: 'The land of enlightenment, salvation, and rich cultural heritage.', isActive: true, displayOrder: 1 },
        { cityId: 'newada', name: 'Nawada (Newada)', state: 'Bihar', desc: 'Home of the famous Kakolat Waterfall, Gunawa Temple & Rajauli Hills.', isActive: true, displayOrder: 2 },
        { cityId: 'patna', name: 'Patna', state: 'Bihar', desc: 'The ancient city of Pataliputra, now a bustling metropolis.', isActive: false, displayOrder: 3 },
        { cityId: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', desc: 'The spiritual capital of India, situated on the banks of the Ganges.', isActive: false, displayOrder: 4 },
        { cityId: 'delhi', name: 'New Delhi', state: 'Delhi', desc: 'The vibrant capital city blending history with modern infrastructure.', isActive: false, displayOrder: 5 }
      ];
      cities = await ExploreCity.insertMany(seedCities);

      // Seed Places
      const seedPlaces = [
        ...gayaPlaces.map(p => ({
          cityId: 'gaya',
          region: 'city',
          title: p.title,
          category: p.category,
          desc: p.desc,
          longDesc: p.longDesc || p.desc,
          image: p.image,
          location: p.location,
          isFeaturedHomepage: p.id === 'mahabodhi-temple' || p.id === 'vishnupad-temple'
        })),
        ...nearbyPlaces.map(p => ({
          cityId: 'gaya',
          region: 'nearby',
          title: p.title,
          category: p.category,
          desc: p.desc,
          longDesc: p.longDesc || p.desc,
          image: p.image,
          location: p.location
        })),
        ...nawadaPlaces.map(p => ({
          cityId: 'newada',
          region: 'city',
          title: p.title,
          category: p.category,
          desc: p.desc,
          longDesc: p.longDesc || p.desc,
          image: p.image,
          location: p.location,
          isFeaturedHomepage: p.id === 'kakolat-waterfall' || p.id === 'gunawa-jain-temple'
        })),
        ...nawadaNearbyPlaces.map(p => ({
          cityId: 'newada',
          region: 'nearby',
          title: p.title,
          category: p.category,
          desc: p.desc,
          longDesc: p.longDesc || p.desc,
          image: p.image,
          location: p.location
        }))
      ];
      await ExplorePlace.insertMany(seedPlaces);
    }

    // Fetch all places
    const places = await ExplorePlace.find({}).sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      cities,
      places
    });
  } catch (error) {
    console.error('Public Explore Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
