const multer = require('multer');
const Product = require('./model');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const upload = multer({dest: '../uploads'});

const getProducts = async (req, res) => {
    try {
      const { search } = req.query;
  
      // Jika 'search' tidak kosong, gunakan regex untuk mencari produk yang cocok dengan query pencarian
      const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  
      const products = await Product.find(query);
      res.send(products);
    } catch (error) {
      res.send(error);
    }
  };


const getProductById = (req, res) => {
  const {id} = req.params;

  Product.findOne({ _id: new ObjectId(id) })
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
        Product.create({user_id,name,price,stock,status,image_url:`http://localhost:3000/uploads/${image.originalname}`})
        .then(result => res.send(result))
        .catch(e => res.send(e));
    }else{
        console.log('Gagal');
        res.send({status:"Gagal"})
    }
};
const updateProductById = async (req, res) => {
    const productId = req.params.id;
    const { name, price, stock, status } = req.body;
    const image = req.file;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }
  
      product.name = name;
      product.price = price;
      product.stock = stock;
      product.status = status;
  
      if (image) {
        product.image_url = `http://localhost:3000/uploads/${image.originalname}`;
  
        const target = path.join(__dirname, '../uploads', image.originalname);
        fs.renameSync(image.path, target);
      }
  
      await product.save();
  
      res.send({ message: 'Product updated successfully' });
    } catch (error) {
      res.send(error);
    }
  };
  
  const deleteProductById = async (req, res) => {
    const productId = req.params.id;
  
    try {
      const result = await Product.findByIdAndDelete(productId);
  
      if (!result) {
        return res.status(404).send({ message: 'Product not found' });
      }
  
      res.send({ message: 'Product deleted successfully' });
    } catch (error) {
      res.send(error);
    }
  };


module.exports = {
    getProducts,
    storeProduct,
    getProductById,
    updateProductById,
    deleteProductById
}