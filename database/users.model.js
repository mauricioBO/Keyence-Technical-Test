const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    'keyenceTest',
    'root',
    'root',
     {
       host: 'localhost',
       dialect: 'mysql'
     }
   );
   
   sequelize.authenticate().then(() => {
      console.log('Connection has been established successfully.');
   }).catch((error) => {
      console.error('Unable to connect to the database: ', error);
   });

const User = sequelize.define("users", {
    userID: {
     type: DataTypes.STRING,
     allowNull: false
   },
   userName: {
     type: DataTypes.STRING,
     allowNull: false
   },
   date: {
     type: DataTypes.DATEONLY,
   },
   punchIn: {
     type: DataTypes.TIME,
   },
   punchOut: {
    type: DataTypes.TIME,
   }
});

sequelize.sync().then(() => {
   console.log('User table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});