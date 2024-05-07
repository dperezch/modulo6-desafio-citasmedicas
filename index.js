const express = require("express");
const app = express();
/* AXIOS */
const axios = require("axios");
/* CHALK */
const chalk = require("chalk");
/* UUID */
const { v4: uuidv4 } = require("uuid");
/* LODASH */
const _ = require("lodash");
/* MOMENT */
const moment = require("moment");

const port = 3000;

let usuarios;

const obtenerUsuarios = () => {
  try {
    axios
      .get("https://randomuser.me/api/?results=20")
      .then((res) => {
        usuarios = res.data;
        //console.log(usuarios);
        usuarios.results.forEach((element) => {
          const id = uuidv4().slice(0, 6);
          const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
          element.id = id;
          element.timestamp = timestamp;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(error);
  }
};

app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`);
  obtenerUsuarios();
});

app.get("/usuarios", (req, res) => {
  const male = _.filter(usuarios.results, function (usuario) {
    return usuario.gender === "male";
  });
  const female = _.filter(usuarios.results, function (usuario) {
    return usuario.gender === "female";
  });

  const olMale = `<ol> ${male.map(
    (usuario) => `<li>
        Nombre: ${usuario.name.first}, Apellido: ${usuario.name.last}, ID: ${usuario.id} - Timestamp: ${usuario.timestamp}
    </li>`
  )} </ol>`;
  const olFemale = `<ol> ${female.map(
    (usuario) => `<li>
    Nombre: ${usuario.name.first}, Apellido: ${usuario.name.last}, ID: ${usuario.id} - Timestamp: ${usuario.timestamp}
    </li>`
  )} </ol>`;
  const lista = `<div> 
                        <p>Mujeres</p> 
                        ${olFemale}
                        <br>
                        <p>Hombres</p>
                        ${olMale}
                    </div>`;
  res.send(lista);
  console.log(chalk.blue.bgWhite.bold(olMale));
  console.log(chalk.red.bgWhite.bold(olFemale));
});
