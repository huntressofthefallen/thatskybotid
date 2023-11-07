const mongoose = require('mongoose');

/**
 * @typedef {Object} CensoredWordsSchema
 * @property {string} word - The censored word.
 * @property {boolean} automod - Whether the automod is enabled for this word.
 * @property {number} category - The category number of the censored word.
 */
const censoredWordsSchema = new mongoose.Schema({
	word: String,
	automod: Boolean,
	category: Number,
}, { timestamps: true });

/**
 * @typedef {Object} AutoModConfigSchema
 * @property {string} action - The action to be taken by the auto moderator.
 * @property {string} length - The length of time for the action.
 * @property {boolean} dm - Whether to send a direct message to the user.
 * @property {number} count - The count of occurrences before the action is triggered.
 */
const autoModConfigSchema = new mongoose.Schema({
	action: String,
	length: String,
	dm: Boolean,
	count: Number,
	timeframe: String,
}, { timestamps: true });

/**
 * @typedef {Object} ServerSettingsSchema
 * @property {string} guildId - The ID of the guild.
 * @property {boolean} autoModeration - Whether auto moderation is enabled.
 * @property {string[]} whitelistWords - The list of whitelisted words.
 * @property {CensoredWordsSchema[]} censoredWords - The list of censored words and their configurations.
 * @property {AutoModConfigSchema[]} autoModConfig - The list of auto moderator configurations.
 * @property {string[]} whitelistChannels - The list of whitelisted channel IDs.
 * @property {string[]} whitelistRoles - The list of whitelisted role IDs.
 */
module.exports = new mongoose.Schema({
	guildId: String,
	autoModeration: Boolean,
	whitelistWords: [String],
	censoredWords: [censoredWordsSchema],
	autoModConfig: [autoModConfigSchema],
	whitelistChannels: [String],
	whitelistRoles: [String],
}, { timestamps: true });