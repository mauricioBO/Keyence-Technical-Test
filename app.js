const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require('cors');
const Sequelize = require("sequelize");
const serverless = require("serverless-http");

//-----------------------Initializatrions----------------------
const app = express();

//--------------------------Settings---------------------------
app.set("port", process.env.port || 3000); // denota que puerto se usa dependiendo del proceso y si no usa el 3000

//-----------------------Middlewares----------------------------
app.use(express.json()); // denoita que la comunicacion de datos entre servidor y cliente sera en formato json
app.use(cors({
  origin: '*'
}));
const router = express.Router();

//----------------------Start server----------------------------
app.listen(app.get("port"), (err) => {
  if (err) throw err;
  console.log(`Server running on port ${app.get("port")}`);
});

//-------------------------Sequelize----------------------------
const sequelize = new Sequelize("keyenceTest", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const DataTypes = require("sequelize");
const User = sequelize.define("users", {
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  punchIn: {
    type: DataTypes.TIME,
  },
  punchOut: {
    type: DataTypes.TIME,
  },
});

//--------------------------Routes-------------------------------
router.get("/", (requerimiento, respuesta) => {
  respuesta.sendFile(path.join(__dirname + "/index.html"));
});

// metodo findAll
router.get("/findAll", (req, response) => {
  sequelize
    .sync()
    .then(() => {
      console.log("User table created successfully!");
      // find all
      User.findAll({
        raw: true,
        nest: true,
      })
        .then((res) => {
          console.log(res);
          response.json(res);
        })
        .catch((error) => {
          console.error("Failed to retrieve data : ", error);
        });
    })
    .catch((error) => {
      console.error("Unable to create table : ", error);
    });
});

// metodo findOne
router.get("/findOne/:userID", (req, response) => {
  const { userID } = req.params;
  // find one
  User.findOne({
    raw: true,
    nest: true,
    where: { userID: userID },
  })
    .then((res) => {
      console.log(res);
      response.json(res);
    })
    .catch((error) => {
      console.error("Failed to retrieve data : ", error);
    });
});

// metodo post
router.post("/insertUser", (req, response) => {
  const { userID, userName, date, punchIn, punchOut } = req.body;
  const newUser = {
    userID: userID,
    userName: userName,
    date: date,
    punchIn: punchIn,
    punchOut: punchOut,
  };
  // post
  User.create(newUser)
    .then((res) => {
      console.log(res instanceof User);
      response.send("Instance successfuly created");
    })
    .catch((error) => {
      console.error("Failed to create instance : ", error);
    });
});

// metodo put
router.put("/updateUser/:userIDParam", (req, response) => {
  const { userIDParam } = req.params;
  const { userName, date, punchIn, punchOut } = req.body;
  const updateUser = {
    userID: userIDParam,
    userName: userName,
    date: date,
    punchIn: punchIn,
    punchOut: punchOut,
  };
  User.update(updateUser, {
    returning: true,
    where: { userID: userIDParam },
  })
    .then((res) => {
      response.send("Instance successfuly updated");
    })
    .catch((error) => {
      console.error("Failed to find instance : ", error);
    });
});

// delete
router.delete("/deleteUser/:userID", (req, response) => {
  const { userID } = req.params;
  User.destroy({
    returning: true,
    where: { userID: userID },
  })
    .then((res) => {
      response.send("Instance successfuly deleted");
    })
    .catch((error) => {
      console.error("Failed to find instance : ", error);
    });
});

app.use('/api/', router);
const handler = serverless(app);

// iniciar servidor digitar "npm run dev" en terminal
