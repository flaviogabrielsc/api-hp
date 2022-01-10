const express = require('express');
const mongoose = require('mongoose');
const character = require('./models/Character')
const app = express();

try {
  mongoose.connect(
    "mongodb+srv://root:123@cluster0.cyrc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log('Banco de dados conectado!')

} catch (err){
  console.log(`Erro ao conectar ao bando de dados ${err}`)
}





app.use(express.json());

const characters = [
  {
    id: 1,
    name: "Harry Potter",
    species: "Human",
    house: "Gryffindor",
    actor: "Daniel Redcliffe",
  },
  {
    id: 2,
    name: "Hermione ",
    species: "Human",
    house: "Gryffindor",
    actor: "Emma Watson ",
  },
];

//GET - READ
app.get("/", (req, res) => {
  res.send(characters.filter(Boolean));
});

//POST - CREATE
app.post("/create", async (req, res) => {
  const {name, species, house, actor} = req.body;

  if(!name || !species || !house || !actor){
    res.status(400).send({ message: 'Você não enviou todos os dados necessários para o cadastro'})
    return;
  }

  const character = await new Character({
    name,
    species,
    house,
    actor, 
  })

  await character.save()

  res.send({ message: "Personagem criado com sucesso!" });
});

//getBYID
app.get("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.find((c) => c.id === id);
  if (!character) {
    res.status(404).send({ message: "Personagem não existe!" });
    return;
  }
  res.send(character);
});

//PUT - UPDATE
app.put("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.find((c) => c.id === id);
  if (!character) {
    res.status(404).send({ message: "Personagem não existe!" });
    return;
  }

  const { name, species, house, actor } = req.body;

  character.name = name;
  character.species = species;
  character.house = house;
  character.actor = actor;

  res.send(character);
});

//DELETE - DELETE
app.delete("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.find((c) => c.id === id);
  if (!character) {
    res.status(404).send({ message: "Personagem não existe!" });
    return;
  }

  const indexCharacter = characters.indexOf(character);
  delete characters[indexCharacter];

  res.send({ message: "Personagem apagado com sucesso!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
