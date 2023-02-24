const fs = require("fs");
const path = require("path");
var moment = require('moment');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'test',
 'root',
 '',
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

const db = {};
let dir = __dirname+'/../models';
console.log('folder:', dir);
fs.readdirSync(dir)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(dir, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ force: false }).then(() => {
    console.log('Notes table created successfully!');
    const notes_data = [
        {title : "abc", note: 'dummy note1', status: 1},
        {title : "pqr", note: 'dummy note2', status: 1},
        {title : "xyz", note: 'dummy note3', status: 1},
     ]
    db.Notes.bulkCreate(notes_data, { validate: true }).then(() => {
        console.log('Bulk/Dummy records added');
    }).catch((err) => { console.log(err); });
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
db.moment = moment;
module.exports = db;
