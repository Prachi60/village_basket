
import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix DNS issues observed previously
dns.setServers(['8.8.8.8', '8.8.4.4']);

const sourceUri = 'mongodb+srv://apnasabjiwalain_db_user:apnasabjiwala123@cluster0.a6wzfmn.mongodb.net/ApnaSabjiWala';
const targetUri = 'mongodb+srv://palakpatel0342_db_user:Ankit@cluster0.hhamzo3.mongodb.net/';

const sourceDbName = 'ApnaSabjiWala';
const targetDbName = 'ApnaSabjiWala';

async function migrate() {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log('Connecting to Source...');
    await sourceClient.connect();
    console.log('Connecting to Target...');
    await targetClient.connect();

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(targetDbName);

    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate.`);

    for (const collInfo of collections) {
      const collectionName = collInfo.name;
      console.log(`\n--- Migrating collection: ${collectionName} ---`);

      // 1. Get indexes
      console.log(`Fetching indexes for ${collectionName}...`);
      const indexes = await sourceDb.collection(collectionName).indexes();
      
      // 2. Fetch data
      console.log(`Fetching data for ${collectionName}...`);
      const data = await sourceDb.collection(collectionName).find({}).toArray();
      
      if (data.length > 0) {
        console.log(`Inserting ${data.length} documents into ${collectionName}...`);
        // Use insertMany for efficiency
        await targetDb.collection(collectionName).insertMany(data);
      } else {
        console.log(`Collection ${collectionName} is empty. Creating it on target anyway.`);
        await targetDb.createCollection(collectionName);
      }

      // 3. Recreate indexes
      for (const index of indexes) {
        if (index.name === '_id_') continue; // Skip default _id index
        
        console.log(`Creating index: ${index.name} on ${collectionName}...`);
        const { name, key, ...options } = index;
        try {
          await targetDb.collection(collectionName).createIndex(key, { ...options, name });
        } catch (idxErr: any) {
          console.error(`Warning: Could not create index ${index.name} on ${collectionName}: ${idxErr.message}`);
        }
      }
      
      console.log(`✓ Finished migrating ${collectionName}`);
    }

    console.log('\n=========================================');
    console.log('🎉 DATA MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=========================================');

  } catch (err) {
    console.error('\n❌ MIGRATION FAILED:');
    console.error(err);
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

migrate();
