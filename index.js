const express = require('express');
const { send } = require('express/lib/response');
const mongoose = require('mongoose');
const Character = require('./models/Character')

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
} catch (err) {
  console.log(`Erro ao conectar ao bando de dados ${err}`)
}



app.use(express.json());

//GETALL - READ ALL
app.get("/characters", async (req, res) => {

  const characters = await Character.find()

  if(characters.length === 0 ){
    return res.status(404).send({ message: 'Não existem personagens cadastrados!'})
  }


  res.send(characters.filter(Boolean));
});

//getBYiD
app.get("/character/:id", async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).send({ message: 'Id invalido'});
      return; 

    }
    
      
      const character = await  Character.findById(id);
      
      if(!character){
        return res.status(404).send({message: 'Personagem não encontrado!'})
      }
      
      
      res.send(character);
    }
  )
//POST - CREATE
app.post("/character", async (req, res) => {
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
