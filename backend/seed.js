const fs = require('fs');
const readline = require('readline');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("pharmacy_v2");
    const medicinesCollection = db.collection("medicines");

    // We will parse the CSV file manually line by line
    const fileStream = fs.createReadStream('../tata_1mg_Medicine_data.csv');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let count = 0;
    const recordsToInsert = [];
    
    // Skip header
    let isHeader = true;

    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue;
      }
      
      // Basic CSV splitting (this is naive but works for simple rows without complex quotes)
      // The CSV has format: Index,Name,MRP,Quantity,Manufacturer,Salt_Composition,Image_URL
      // We will split by comma, but be careful with quotes in Salt_Composition.
      // Better yet, just use a regex for standard CSV splitting
      const row = line.match(/(?:"[^"]*"|^[^"]*$|[^,]+)+/g);
      
      if (row && row.length >= 6) {
        const name = row[1] ? row[1].replace(/^"|"$/g, '').trim() : "Unknown";
        const priceStr = row[2] ? row[2].replace(/^"|"$/g, '').trim() : "0";
        const quantity = row[3] ? row[3].replace(/^"|"$/g, '').trim() : "";
        const manufacturer = row[4] ? row[4].replace(/^"|"$/g, '').trim() : "";
        const salt = row[5] ? row[5].replace(/^"|"$/g, '').trim() : "";
        
        // Skip rows with bad data
        if (!name || name === "Unknown" || isNaN(parseFloat(priceStr))) continue;

        const medicine = {
          name: name,
          category: "General Medicine",
          price: parseFloat(priceStr),
          stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10 and 110
          targetSpecies: 'Human',
          description: `Manufacturer: ${manufacturer} | Packaging: ${quantity}`,
          composition: salt,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        recordsToInsert.push(medicine);
        count++;

        // Stop after we have 15 good medicines
        if (count >= 15) {
          break;
        }
      }
    }

    if (recordsToInsert.length > 0) {
      // Clear old data for a fresh start (optional, but good for a demo)
      // await medicinesCollection.deleteMany({});
      
      const result = await medicinesCollection.insertMany(recordsToInsert);
      console.log(`Successfully inserted ${result.insertedCount} medicines from the Kaggle dataset!`);
    } else {
      console.log("No valid records found to insert.");
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
