const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const Character = require("../models/Character");


router.get("/", async (req, res) => {
    const characters = await Character.find();
  
    if (characters.length === 0) {
      return res
        .status(404)
        .send({ message: "Não existem personagens cadastrados!" });
    }
  
    res.send(characters.filter(Boolean));
  });
  
  //getBYiD
  router.get("/character/:id", async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: "Id invalido" });
      return;
    }
  
    const character = await Character.findById(id);
  
    if (!character) {
      return res.status(404).send({ message: "Personagem não encontrado!" });
    }
  
    res.send(character);
  });
  //POST - CREATE
  router.post("/add-character", async (req, res) => {
    const { name, species, house, actor } = req.body;
  
    if (!name || !species || !house || !actor) {
      res
        .status(400)
        .send({
          message: "Você não enviou todos os dados necessários para o cadastro",
        });
      return;
    }
  
    const character = await new Character({
      name,
      species,
      house,
      actor,
    });
  
    await character.save();
  
    res.send({ message: "Personagem criado com sucesso!" });
  });
  
  //PUT - UPDATE
  router.put("/character/:id", async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: "Id invalido" });
      return;
    }
  
    const character = await Character.findById(id);
  
    if (!character) {
      return res.status(404).send({ message: "Personagem não encontrado!" });
    }
  
    const { name, species, house, actor } = req.body; 
  
    if (!name || !species || !house || !actor) {
      res
        .status(400)
        .send({
          message: "Você não enviou todos os dados necessários para a atualização",
        });
      return;
    }
    character.name = name;
    character.species = species;
    character.house = house;
    character.actor = actor 
  
    await character.save() // He will wait
  
  res.send({message: `Personagem atualizado com sucesso! ${character}`})
  
    res.send(character);
  });
  
  //DELETE - DELETE
  router.delete("/character/:id", async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ message: "Id invalido" });
      return;
    }
  
    const character = await Character.findById(id)
  
  if(!character){
    return res.status(404).send({message: 'Esse personagem não existe!'})
  }
  
    await character.remove()
  
    res.send({ message: "Personagem apagado com sucesso!" });
  });
  
  module.exports = router 