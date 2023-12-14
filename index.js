const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const cors = require('cors')

app.use(cors());

mongoose.connect('mongodb://localhost:27017/Books', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'erro de conexão com MongoDB:'));
db.once('open', () => {
  console.log('Conectou ao MongoDB');
});


const livroSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number, required: true , unique: true},
    titulo: { type: String, required: true },
    num_paginas: { type: Number, required: true },
    isbn: { type: String, required: true },
    editora: { type: String, required: true },
  });

  const Livro = mongoose.model('Livro', livroSchema);

  app.use(bodyParser.json());
  
 
  app.get('/livros', async (req, res) => {
    try {
      const livros = await Livro.find();
      res.json(livros);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.get('/livros/:id', async (req, res) => {
    const livroId = req.params.id;
    try {
      const livro = await Livro.findOne({ id: livroId });
      if (!livro) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
      res.json(livro);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.post('/livros', async (req, res) => {
    const newLivro = req.body;
    try {
      const createdLivro = await Livro.create(newLivro);
      res.status(201).json(createdLivro);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.put('/livros/:id', async (req, res) => {
    const livroId = req.params.id;
    const updatedLivro = req.body;
    try {
      const result = await Livro.updateOne({ id: livroId }, updatedLivro);
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
      res.json({ message: 'Livro atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.delete('/livros/:id', async (req, res) => {
    const livroId = req.params.id;
    try {
      const result = await Livro.deleteOne({ id: livroId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
      res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });