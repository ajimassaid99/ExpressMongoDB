const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({dest: '../uploads'});
const db = require('../config/mongodb');
const { ObjectId } = require('mongodb');

const getProducts = (req, res) => {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  
    db.collection('products').find(query)
      .toArray()
      .then(result => res.send(result))
      .catch(error => res.send(error));
  };


const getProductById = (req, res) => {
  const {id} = req.params;

  db.collection('products').findOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.send({ status: 'Produk tidak ditemukan' });
      }
    })
    .catch((error) => res.send(error));
};
  

const storeProduct = async (req,res) =>{
    const {user_id,name,price,stock,status} =req.body;
    const image = req.file;
    if(image){  
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
        try{
            const imageUrl = `http://localhost:3000/uploads/${image.originalname}`;
      const result = await db.collection('products').insertOne({
        user_id,
        name,
        price,
        stock,
        status,
        image_url: imageUrl
      });

      res.send(result);
        }catch(error){
            res.send(error);
        }
    }else{
        console.log('Gagal');
        res.send({status:"Gagal"})
    }
}

const UpdateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, price, stock, status } = req.body;
    const image = req.file;
    if(image){  
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);

        const filter = { _id: new ObjectId(productId) };
        const update = {
            $set: {
            name: name,
            price: price,
            stock: stock,
            status: status,
            image_url: `http://localhost:3000/uploads/${image.originalname}`
            }
        };
        try {
            const result = await db.collection('products').updateOne(filter, update);
            if (result.matchedCount > 0) {
              res.send(result);
            } else {
                res.status(404).send({ message: 'Product not found' });
            }
        } catch (error) {
        res.send(error);
        }
    }
  } 

  const deleteProductById = async (req, res) => {
    const productId = req.params.id;
  
    try {
      const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
  
      if (result.deletedCount >= 1) {
        res.send({ message: 'Product deleted successfully' });
      } else {
        res.status(404);
        res.send({ message: 'Product not found' });
      }
    } catch (error) {
      res.send(error);
    }
  };


module.exports = {
    getProducts,
    storeProduct,
    getProductById,
    UpdateProduct,
    deleteProductById
}