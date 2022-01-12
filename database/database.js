const database = () => {
    const mongoose = require("mongoose");


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
}
module.exports = database()



