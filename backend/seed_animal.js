const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seedAnimalDatabase() {
  try {
    await client.connect();
    const db = client.db("pharmacy_v2");
    const medicinesCollection = db.collection("medicines");

    const workbook = xlsx.readFile('../Animal Drugs Dataset.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    let count = 0;
    const recordsToInsert = [];

    for (let row of data) {
      if (row && row.name) {
        const medicine = {
          name: row.name.trim(),
          category: row.type ? row.type.trim() : "Veterinary Medicine",
          price: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)), // Random price between 50 and 500
          stock: Math.floor(Math.random() * 100) + 10,
          targetSpecies: 'Animal',
          description: `Company: ${row.company || 'Unknown'} | Format: ${row.type || 'Unknown'} | Size: ${row['size(ml)'] || 'Unknown'}`,
          composition: row.composition ? row.composition.trim() : "",
          createdAt: new Date(),
          updatedAt: new Date()
        };

        recordsToInsert.push(medicine);
        count++;

        // Insert up to 15 records
        if (count >= 15) {
          break;
        }
      }
    }

    if (recordsToInsert.length > 0) {
      const result = await medicinesCollection.insertMany(recordsToInsert);
      console.log(`Successfully inserted ${result.insertedCount} ANIMAL medicines from the Excel dataset!`);
    } else {
      console.log("No valid records found to insert.");
    }

  } catch (error) {
    console.error("Error seeding animal database:", error);
  } finally {
    await client.close();
  }
}

seedAnimalDatabase();
