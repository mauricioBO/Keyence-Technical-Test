const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("keyenceTest", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = {
  init: function () {
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((error) => {
        console.error("Unable to connect to the database: ", error);
      });
  },
  findAll: function () {
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
    sequelize
      .sync()
      .then(() => {
        console.log("User table created successfully!");

        // CREATE
        // User.create({
        //   userID: "0001",
        //   userName: "AAA",
        //   date: "1/1/2022",
        //   punchIn: "9:00:00",
        //   punchOut: "6:00:00",
        // })
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((error) => {
        //     console.error("Failed to create a new record : ", error);
        //   });

        // FIND
        User.findAll({
          raw: true,
          nest: true,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.error("Failed to retrieve data : ", error);
          });
      })
      .catch((error) => {
        console.error("Unable to create table : ", error);
      });
  },
};
