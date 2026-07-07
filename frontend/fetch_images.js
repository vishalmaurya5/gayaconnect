const https = require('https');

const titles = [
  "Nava_Nalanda_Mahavihara",
  "Vulture_Peak",
  "Nalanda_Archaeological_Museum",
  "Xuanzang_Memorial_Hall",
  "Son_Bhandar_Caves",
  "Cyclopean_Wall_of_Rajgir",
  "Barabar_Caves",
  "Deo_Surya_Mandir",
  "Indian_Institute_of_Management_Bodh_Gaya",
  "Central_University_of_South_Bihar",
  "Gaya_College",
  "Gaya_College_of_Engineering",
  "Anugrah_Narayan_Magadh_Medical_College_and_Hospital",
  "Dashrath_Manjhi"
];

async function fetchImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            resolve({ title, url: pages[pageId].thumbnail.source });
          } else {
            resolve({ title, url: null });
          }
        } catch (e) {
          resolve({ title, url: null });
        }
      });
    }).on('error', () => resolve({ title, url: null }));
  });
}

async function main() {
  for (const title of titles) {
    const res = await fetchImage(title);
    console.log(`${res.title}: ${res.url}`);
  }
}
main();
