# Spaced repetition API

Balay Aydemir and Michael Kirsch

Live app: https://michael-balay-spaced-repetition.now.sh/
Client repo: https://github.com/thinkful-ei-heron/Balay-Michael-spaced-repetition

This is the API for an app that teaches some Turkish vocabulary using the spaced repetition technique.

## API Overview:

```
/api
.
├── /auth
│   └── POST    /token      (login: {username, password})
│   └── PUT     /token      (refresh JWT)
|
├── /user
│   └── POST    /           (create new user: {name, username, password})
|
|
├── /language
│   └── GET     /           (get detailed word list and language info)
│   └── GET     /head       (get next word)
│   └── POST    /guess      (submit {guess}, returns updated score info and next word)
```
