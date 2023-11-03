require('dotenv').config();
const mongoose = require('mongoose');
const modConfigSchema = require('../../schema/s/modConfig');

let conn = mongoose.connections.find(con => con.name === 's');
if (!conn) {
	conn = mongoose.createConnection(`${process.env.MONGODB}/thatskygameid?retryWrites=true&w=majority`);
	conn.name = 's';
}
const modConfig = conn.models.modConfig ? conn.models.modConfig : conn.model('modConfig', modConfigSchema);

module.exports = modConfig;