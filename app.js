require('./config/mongoose');
const express = require('express');
const app = express();
// const ProductsRouter = require('./product/routes');
// const ProductsRouterV2 = require('./product_v2/routes');
const ProductsRouterV3 = require('./product_v3/routes');
const ProductsRouterV4 = require('./product_v4/routes');
const log = require('./middlewares/logger');
const path = require('path');
const cors = require('cors');

app.use(log);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/v1', ProductsRouter);
// app.use('/api/v2', ProductsRouterV2);
app.use(cors());
app.use('/api/v3',ProductsRouterV3);
app.use('/api/v4',ProductsRouterV4);
app.use((req, res, next) => {
  res.send({
    status: 'Failed',
    message: 'Resource ' + req.originalUrl + ' Not Found',
  });
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
