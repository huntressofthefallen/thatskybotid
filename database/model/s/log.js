require('dotenv').config();
const mongoose = require('mongoose');
const logSchema = require('../../schema/s/log');

let conn = mongoose.connections.find(con => con.name === 's');
if (!conn) {
	conn = mongoose.createConnection(`${process.env.MONGODB}/thatskygameid?retryWrites=true&w=majority`);
	conn.name = 's';
}
const log = conn.models.log ? conn.models.log : conn.model('log', logSchema);

module.exports = log;