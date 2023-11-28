require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { connect, Schema, model, models } = require('mongoose');
connect(process.env.smongodbtoken).catch(err => console.error(err.message));
const automodSchema = new Schema({ word: String }, { timestamps: true });
const manmodSchema = new Schema({ word: String }, { timestamps: true });
const whitelistSchema = new Schema({ word: String }, { timestamps: true });
let automoddb;
let manmoddb;
let whitelistdb;

if (models.whitelist) {
	whitelistdb = model('whitelist');
}
else {
	whitelistdb = model('whitelist', whitelistSchema);
}

if (models.manmod) {
	manmoddb = model('manmod');
}
else {
	manmoddb = model('manmod', manmodSchema);
}

if (models.automod) {
	automoddb = model('automod');
}
else {
	automoddb = model('automod', automodSchema);
}

const censorship = require('../database/idbadwords.json');
const am = [];
const mm = [];
const wh = [];
censorship.P1.forEach(w => {
	am.push({ word: w });
});
censorship.P2.forEach(w => {
	mm.push({ word: w });
});
censorship.S.forEach(w => {
	wh.push({ word: w });
});
automoddb.insertMany(am).then(() => { console.log(JSON.stringify(am, null, 2)); });
manmoddb.insertMany(mm).then(() => { console.log(JSON.stringify(mm, null, 2)); });
whitelistdb.insertMany(wh).then(() => { console.log(JSON.stringify(wh, null, 2)); });