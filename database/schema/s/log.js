const mongoose = require('mongoose');

/**
 * @typedef {Object} ModerationLog
 * @property {string} guildId - The ID of the Discord guild where the moderation action took place.
 * @property {string} guildName - The name of the Discord guild where the moderation action took place.
 * @property {string} channelId - The ID of the Discord channel where the original message was sent.
 * @property {string} channelName - The name of the Discord channel where the original message was sent.
 * @property {string} userId - The ID of the user who was subject to the moderation action.
 * @property {string} userTag - The Discord tag (username#discriminator) of the user who was subject to the moderation action.
 * @property {string} modId - The ID of the moderator who performed the moderation action.
 * @property {string} modTag - The Discord tag (username#discriminator) of the moderator who performed the moderation action.
 * @property {string} action - The type of moderation action performed (e.g., ban, mute, kick).
 * @property {string} reason - The reason for the moderation action.
 * @property {string} notes - Optional notes or comments from the moderator about the moderation action.
 * @property {string} [length='-'] - The duration of the moderation action, if applicable (e.g., for temporary bans or mutes).
 * @property {string} [messageContent='-'] - The content of the original message that led to the moderation action.
 * @property {Array.<string>} attachmentUrls - An array of URLs for any attachments included in the original message.
 * @property {boolean} dmStatus - A flag indicating whether the DM to the user has been sent successfully or not.
 * @property {boolean} actionStatus - A flag indicating whether the moderation action was successful or not.
 * @property {Date} createdAt - The timestamp when the moderation log entry was created.
 * @property {Date} updatedAt - The timestamp when the moderation log entry was last updated.
 */
module.exports = new mongoose.Schema({
	guildId: String,
	guildName: String,
	channelId: String,
	channelName: String,
	userId: String,
	userTag: String,
	modId: String,
	modTag: String,
	action: String,
	reason: String,
	notes: { type: String, default: '-' },
	length: { type: String, default: '-' },
	messageContent: { type: String, default: '-' },
	attachmentUrls: { type: [String], default: [] },
	dmStatus: { type: Boolean, default: false },
	actionStatus: { type: Boolean, default: false },
}, { timestamps: true });