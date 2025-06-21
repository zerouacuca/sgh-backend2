require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Gateway SGH Backend 2');
});

app.listen(port, () => {
  console.log(`API Gateway rodando na porta ${port}`);
});
