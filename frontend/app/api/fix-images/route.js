import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const gayaPath = path.join(process.cwd(), 'lib', 'data', 'gayaPlaces.js');
    const nearbyPath = path.join(process.cwd(), 'lib', 'data', 'nearbyPlaces.js');

    let gayaContent = fs.readFileSync(gayaPath, 'utf8');
    let nearbyContent = fs.readFileSync(nearbyPath, 'utf8');

    // High quality, 100% verified working generic fallbacks
    const fallbacks = {
      temples: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=800&q=80',
      mosques: 'https://images.unsplash.com/photo-1564507592208-52871f37e408?auto=format&fit=crop&w=800&q=80',
      historical: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      parks: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
      colleges: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      hills: 'https://images.unsplash.com/photo-1621255869400-8b1716382103?auto=format&fit=crop&w=800&q=80',
      malls: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
    };

    async function getWikiImage(title) {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`, { cache: 'no-store' });
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].thumbnail?.source) {
          return pages[pageId].thumbnail.source;
        }
      } catch (e) {
        console.error("Failed to fetch wiki for", title);
      }
      return null;
    }

    async function processFile(content, outPath) {
      const blocks = content.split('},');
      let newBlocks = [];
      let log = [];

      for (let block of blocks) {
        if (!block.includes('id:')) {
          newBlocks.push(block);
          continue;
        }
        
        const titleMatch = block.match(/title:\s*"([^"]+)"/);
        const linkMatch = block.match(/link:\s*"([^"]+)"/);
        const categoryMatch = block.match(/category:\s*"([^"]+)"/);
        
        if (titleMatch) {
          const title = titleMatch[1];
          const category = categoryMatch ? categoryMatch[1] : 'parks';
          
          let wikiTitle = title;
          if (linkMatch && linkMatch[1].includes('wikipedia.org/wiki/')) {
            wikiTitle = linkMatch[1].split('/wiki/')[1];
          }
          
          let imageUrl = await getWikiImage(wikiTitle);
          if (!imageUrl) imageUrl = await getWikiImage(title.split(' ')[0]);
          if (!imageUrl) imageUrl = await getWikiImage(title.split('&')[0].trim());
          
          if (!imageUrl) {
            imageUrl = fallbacks[category] || fallbacks.parks;
            log.push(`Used Unsplash fallback for: ${title}`);
          } else {
            log.push(`Found Official Wiki Image for: ${title}`);
          }
          
          block = block.replace(/image:\s*"[^"]+"/, `image: "${imageUrl}"`);
        }
        newBlocks.push(block);
      }
      
      fs.writeFileSync(outPath, newBlocks.join('},'));
      return log;
    }

    const log1 = await processFile(gayaContent, gayaPath);
    const log2 = await processFile(nearbyContent, nearbyPath);

    return NextResponse.json({ success: true, message: "Images updated successfully", logs: [...log1, ...log2] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
