
import { MongoClient } from 'mongodb';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const sourceUri = 'mongodb+srv://apnasabjiwalain_db_user:apnasabjiwala123@cluster0.a6wzfmn.mongodb.net/ApnaSabjiWala';

async function listCollections() {
  const client = new MongoClient(sourceUri);
  try {
    await client.connect();
    console.log('Connected to Source');
    const db = client.db('ApnaSabjiWala');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    for (const collInfo of collections) {
      const count = await db.collection(collInfo.name).countDocuments();
      console.log(` - ${collInfo.name}: ${count} documents`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

listCollections();
