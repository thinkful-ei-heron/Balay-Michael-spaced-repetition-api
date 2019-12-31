const LinkedList = require('../util/linked-list');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  async getLanguageList(db, language_id) {
    const words = await this.getLanguageWords(db, language_id);
    const list = new LinkedList();
    const head = await db
      .from('language')
      .select('head')
      .where({ id: language_id })
      .first();

    console.log(head);

    let currentWord = words.find(word => word.id === head.head);

    while (currentWord) {
      list.insertLast(currentWord);
      currentWord = words.find(word => word.id === currentWord.next);
    }
    return list;
  },

  async persistLanguageList(db, language_id, list) {
    await db.transaction(trx => {
      //get next word and update head
      // console.log('persist:');
      // list.printList();
      let cur = list.pop();
      // console.log(cur.id);
      this.updateLanguageHead(db, language_id, cur.id);
      //build array of queries: update next, memory value, counts in place
      const queries = [];
      while (cur) {
        // console.log('cur :', cur);
        nextItem = list.pop();
        if (nextItem) list.insertFirst(nextItem);
        cur.next = nextItem ? nextItem.id : null;
        // console.log(cur);
        queries.push(
          db('word')
            .where('id', cur.id)
            .update({
              next: cur.next,
              memory_value: cur.memory_value,
              correct_count: cur.correct_count,
              incorrect_count: cur.incorrect_count
            })
            .transacting(trx)
        );
        cur = list.pop();
      }

      Promise.all(queries)
        .then(trx.commit)
        .catch(trx.rollback);
    });
    // console.log('persist');
  },

  async updateLanguageHead(db, language_id, newHeadId) {
    console.log('update head: ', newHeadId)
    await db('language')
      .where({ id: language_id })
      .update({ head: newHeadId });
  },

  updateLanguageScore(db, language_id, newScore) {
    db('language')
      .where({ id: language_id })
      .update({ total_score: newScore });
  }
};

module.exports = LanguageService;
