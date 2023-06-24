const {MongoClient} = require('mongodb');
const url = 'mongodb://root:Horizon2021@localhost:27017';
const client = new MongoClient(url);

(async ()=>{
    try{
        await client.connect();
        console.log('Koneksi Berhasil');
    }catch(e){
        console.error('error : ',e);
    }
})();

const db = client.db('eduworkdb');

module.exports = db;