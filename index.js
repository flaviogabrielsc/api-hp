require('dotenv').config()
const express = require("express");
const { send } = require("express/lib/response");
const mongoose = require("mongoose");
const Character = require("./models/Character");

const app = express();

const port = process.env.PORT || 3000;

try {
  mongoose.connect(
    process.env.DATABASE_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("Banco de dados conectado!");
} catch (err) {
  console.log(`Erro ao conectar ao bando de dados ${err}`);
}

app.use(express.json());

//GETALL - READ ALL
app.get("/characters", async (req, res) => {
  const characters = await Character.find();

  if (characters.length === 0) {
    return res
      .status(404)
      .send({ message: "Não existem personagens cadastrados!" });
  }

  res.send(characters.filter(Boolean));
});

//getBYiD
app.get("/character/:id", async (req, res) => {
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
app.post("/character", async (req, res) => {
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
app.put("/character/:id", async (req, res) => {
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
app.delete("/character/:id", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
