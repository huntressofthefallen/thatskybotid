const { modConfig } = require('../../database/lib/s');

/**
 * Transforms a ServerSettingsSchema object into the desired format.
 * @param {ServerSettingsSchema} serverSettings - The server settings object.
 * @returns {Object} The transformed object.
 */
const transformServerSettings = (serverSettings) => {
  const result = {
    P1: [],
    P2: [],
    S: serverSettings.whitelistWords,
  };

  serverSettings.censoredWords.forEach((censoredWord) => {
    if (censoredWord.automod) {
      result.P1.push(censoredWord.word);
    }
    else {
      result.P2.push(censoredWord.word);
    }
  });

  return result;
};

module.exports = async (args) => {
  const data = await modConfig.findOne({ guildId: '1009644872065613864' });
  const idbadwords = transformServerSettings(data);

  const censorship = { count: 0, words: [] };

  idbadwords.S.forEach(async (s) => {
    args.forEach(async (a, i) => {
      if (a.includes(s)) {
        args.splice(i, 1);
      }
    });
  });

  idbadwords.P1.forEach(async (w) => {
    args.forEach(async (a) => {
      if (a.includes(w)) {
        censorship.count++;
        censorship.words.push({ word: w, det: a, cat: 1 });
      }
    });
  });

  idbadwords.P2.forEach(async (w) => {
    args.forEach(async (a) => {
      if (a.includes(w)) {
        censorship.count++;
        censorship.words.push({ word: w, det: a, cat: 2 });
      }
    });
  });

  censorship.words.forEach(async (fil1, j) => {
    censorship.words.forEach(async (fil2, i) => {
      if (fil1.cat <= fil2.cat && fil1.word == fil2.word && i != j) {
        censorship.words.splice(i, 1);
      }
    });
  });

  idbadwords.S.forEach(async (s) => {
    censorship.words.forEach(async (fill, i) => {
      if (fill.det == s) {
        censorship.words.splice(i, 1);
      }
    });
  });

  return censorship;
}