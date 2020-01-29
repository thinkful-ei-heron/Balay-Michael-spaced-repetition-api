const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const bodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  const { head, total_score } = req.language;
  const words = await LanguageService.getLanguageWords(
    req.app.get('db'),
    req.language.id
  );
  const nextWord = words.find(word => word.id === head);
  const response_object = {
    nextWord: nextWord.original,
    wordCorrectCount: nextWord.correct_count,
    wordIncorrectCount: nextWord.incorrect_count,
    totalScore: total_score
  };
  res.json(response_object);
});

languageRouter.post('/guess', bodyParser, async (req, res, next) => {
  const { guess } = req.body;
  const db = req.app.get('db');
  const languageId = req.language.id;
  if (!guess) {
    return res.status(400).json({
      error: `Missing 'guess' in request body`
    });
  }
  let { total_score } = req.language;
  const langList = await LanguageService.getLanguageList(db, languageId);
  let cur = langList.pop();
  let nextWord = langList.peek();
  const isCorrect = guess === cur.translation;

  if (isCorrect) {
    cur.memory_value *= 2;
    cur.correct_count++;
    await LanguageService.updateLanguageScore(db, languageId, ++total_score);
  } else {
    cur.memory_value = 1;
    cur.incorrect_count++;
  }
  langList.insertAt(cur, cur.memory_value);

  await LanguageService.persistLanguageList(db, languageId, langList);
  const response_object = {
    totalScore: total_score,
    nextWord: nextWord.original,
    isCorrect,
    wordCorrectCount: cur.correct_count,
    wordIncorrectCount: cur.incorrect_count,
    answer: cur.translation
  };
  res.json(response_object);
});

module.exports = languageRouter;
