# alkitab

![npm](https://img.shields.io/npm/v/@anchovy_studios/alkitab) ![GitHub issues](https://img.shields.io/github/issues/anchovy-studios/alkitab) ![NPM](https://img.shields.io/npm/l/@anchovy_studios/alkitab)

Holy Bible in Indonesian.

## Requirement

[Node.js](https://nodejs.org/en/) 12.0.0 or higher

## Installation

Installation is done using the npm install command:
```bash
$ npm install @anchovy_studios/alkitab
```

## Quick Start

```javascript
const { Alkitab } = require('@anchovy_studios/alkitab')

// create new instance
const myAlkitab = new Alkitab()

// or using static method
Alkitab.getVersion(true)
```

## Static Methods
- [`getVersion(log)`](#getVersion)
- [`getBookList(sorted)`](#getBookList)

### `getVersion(log)` <a id="getVersion"></a>
Get the installed version of this library and the latest version from npm registry
- `log` : if `true`, print and return the result to the console. if `false`, return only the result. The default value is `false`.

```javascript
// print also
Alkitab.getVersion(true)

//without print
console.log(Alkitab.getVersion())
```
OUTPUT
```bash
// with log = true
Checking npm registry ...
Hi ^-^
Your current version is 0.0.1.
The latest version is 1.0.0. Consider updating your library with npm install command.

// with log = false
{
  current: '0.0.1',
  latest: '1.0.0',
  message: 'Hi ^-^\n' +
    'Your current version is 0.0.1.\n' +
    'The latest version is \u001b[33m1.0.0\u001b[0m. Consider updating your library with \u001b[32mnpm install\u001b[0m command.'
}
```

### `getBookList(sorted)` <a id="getBookList"></a>
Get the list of valid and available book that can be used in [`getVerse(book, chapter, verse, options)`](#getVerse), [`getVerseByQuery(query, options)`](#getVerseByQuery), or [`getVerseByOptions(options)`](#getVerseByOptions)
- `sorted` : if `true`, get list in sorted order according the Bible order. `false` otherwise. The default value is false.

```javascript
// without sorted
console.log(Alkitab.getBookList())

// with sorted
console.log(Alkitab.getBookList(true))
```

OUTPUT

```bash
// without sorted
[
  '1 Korintus',   '1 Petrus',         '1 Raja-raja',
  '1 Samuel',     '1 Tawarikh',       '1 Tesalonika',
  '1 Timotius',   '1 Yohanes',        '2 Korintus',
  ...
]

// with sorted
[
  'Kejadian',     'Keluaran',         'Imamat',
  'Bilangan',     'Ulangan',          'Yosua',
  'Hakim-hakim',  'Rut',              '1 Samuel',
  ...
]
```

## Methods

- [`getInstanceError()`](#getInstanceError) [**DEPRECATED**]
- [`getAllErrors(formatted)`](#getAllErrors)
- [`clearErrors(maxTime)`](#clearErrors)
- [`getVerse(book, chapter, verse, options)`](#getVerse)
- [`getVerseByQuery(query, options)`](#getVerseByQuery)
- [`getVerseByOptions(options)`](#getVerseByOptions)

### `getInstanceError()` (DEPRECATED) <a id="getInstanceError"></a>
**DEPRECATED since 0.1.0**

**(Old)** Get all errors produce by this instance only. Returns an array of AlkitabException object.

**(Now)** Returns an empty array

```javascript
// old
console.log(myAlkitab.getInstanceError())

//now
console.log(myAlkitab.getInstanceError())
```

OUTPUT

```
// old
[
  AlkitabException:
  Oopps!! Error detected!!
  We're sorry we can not find the book of adf in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method.
  Cause: Book not found!
  Native error: undefined
  Time: Friday, May 08, 2020, 06:26:29 PM

      at Alkitab.getAllErrors (E:\alkitab\app.js:90:29)
      at Object.<anonymous> (E:\alkitab\app.js:167:15)
      at Module._compile (internal/modules/cjs/loader.js:959:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:995:10)
      ...
]

//now
[]
```

### `getAllErrors(formatted, maxTime)` <a id="getAllErrors"></a>
Get all errors that ever happen since you install this library. The actual files can be found in `logs/`. The errors will be an instance of `AlkitabException` object. This method will delete all the log files from the beginning until the time specified in the parameter.

- `formatted` : if `true` returns an array of `AlkitabException` object. if `false` returns an array of raw string error logs. The default value is false.
- `maxTime` : the maximum time for log files to be deleted. The default value is now using the `new Date().getTime()` function. 

```javascript
console.log(myAlkitab.getAllErrors())
console.log(myAlkitab.getAllErrors(true))
```

OUTPUT

```bash
// with formatted = false
[
  "Friday, May 08, 2020, 05:05:38 PM | We're sorry we can not find the book of adf in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method. | Cause: Book not found! | Native error: undefined",
  "...",
  ...
]

// with formatted = true
[
  AlkitabException:
  Oopps!! Error detected!!
  We're sorry we can not find the book of adf in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method.
  Cause: Book not found!
  Native error: undefined
  Time: Friday, May 08, 2020, 06:26:29 PM

      at Alkitab.getAllErrors (E:\alkitab\app.js:90:29)
      at Object.<anonymous> (E:\alkitab\app.js:167:15)
      at Module._compile (internal/modules/cjs/loader.js:959:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:995:10)
      ...
  },
```

### `clearErrors(maxTime)` <a id="clearErrors"></a>
Clear all error within the `/logs` folder until the specified time.

- `maxTime` : an integer value represent the millisecond time. Use the `Date.getTime()` function to get this value. The default value is now using the `new Date().getTime()` function.

```javascript
console.log(myAlkitab.clearErrors(new Date('2020-05-01').getTime()))
```

OUTPUT

```bash
[
  '1838900000000.log',
  '1839000000000.log',
  ...
]
```

### `getVerse(book, chapter, verse, options)` <a id="getVerse"></a>

Get one verse (as a string) or all verses within a chapter (as an array of stirng) with the specified parameters.

- `book` : a string for the Book. Use `getListBook()` to see all Book option. Make sure the string match exactly with the string from `getListBook()`.
- `chapter` : a number (or a string but can be converted to number) for the chapter of the book
- `verse` : a number (or a string but can be converted to number) and can be filled with `false` or `undefined` to get all the verses in the chapter.
- `options` : an object for extra option that contains any of these attribute
  - `fromEn` : Set this to true to receive the verse in Indonesian if the book is in English.

Throw `AlkitabException` for every invalid parameters.

```javascript
console.log(myAlkitab.getVerse('Matius', '1', '1'))
console.log(myAlkitab.getVerse('Matius', '1'))
// will throw an error
console.log(myAlkitab.getVerse('matius', '1'))
```

OUTPUT

```bash
// one verse
Inilah silsilah Yesus Kristus, anak Daud, anak Abraham.

// one chapter
[
  'Inilah silsilah Yesus Kristus, anak Daud, anak Abraham.',
  'Abraham memperanakkan Ishak, Ishak memperanakkan Yakub, Yakub memperanakkan Yehuda dan saudara-saudaranya,',
  'Yehuda memperanakkan Peres dan Zerah dari Tamar, Peres memperanakkan Hezron, Hezron memperanakkan Ram,',
  'Ram memperanakkan Aminadab, Aminadab memperanakkan Nahason, Nahason memperanakkan Salmon,',
  'Salmon memperanakkan Boas dari Rahab, Boas memperanakkan Obed dari Rut, Obed memperanakkan Isai,',
  ...
]

// error
AlkitabException:
Oopps!! Error detected!!
We're sorry we can not find the book of matius in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method.
Cause: Book not found!
Native error: undefined
Time: Friday, May 08, 2020, 06:49:52 PM

    at Alkitab.#parseVerse (E:\alkitab\app.js:45:19)
    at Alkitab.getVerse (E:\alkitab\app.js:57:32)
...
```

### `getVerseByQuery(query, options)` <a id="getVerseByQuery"></a>

Get one verse (as a string) or all verses within a chapter (as an array of stirng) with the full query string. The string must exactly match this format : `<book>(space)<chapter>:<verse>`

- `query` : a query string that match the above format.
- `options` : an object for extra option that contains any of these attribute
  - `fromEn` : Set this to true to receive the verse in Indonesian if the book is in English.

Throw `AlkitabException` for every invalid parameters.

```javascript
myAlkitab.getVerseByQuery('Exodus 1:1', {fromEn: true})

// this will cause error because fromEn options was not set
myAlkitab.getVerseByQuery('Exodus 1')
```

OUTPUT

```bash
Inilah nama para anak Israel yang datang ke Mesir bersama-sama dengan Yakub; mereka datang dengan keluarganya masing-masing:

// error
AlkitabException:
Oopps!! Error detected!!
We're sorry we can not find the book of Exodus in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method.
Cause: Book not found!
Native error: undefined
Time: Friday, May 08, 2020, 06:58:05 PM
...
```

### `getVersionByOptions(options)` <a id="getVerseByOptions"></a>

Get one verse (as a string) or all verses within a chapter (as an array of stirng) with the specified parameters as options. 

- `options` : an object for extra option that contains any of these attribute
  - `fromEn` : Set this to true to receive the verse in Indonesian if the book is in English.
  - `book` : a string for the Book. Use `getListBook()` to see all Book option. Make sure the string match exactly with the string from `getListBook()`.
  - `chapter` : a number (or a string but can be converted to number) for the chapter of the book
  - `verse` : a number (or a string but can be converted to number) and can be filled with `false` or `undefined` to get all the verses in the chapter.

```javascript
myAlkitab.getVerseByOptions({book: 'Mazmur', chapter: '3', verse: '1'})
```

OUTPUT

```bash
Mazmur Daud, ketika ia lari dari Absalom, anaknya. (3-2) Ya TUHAN, betapa banyaknya lawanku! Banyak orang yang bangkit menyerang aku;
```

## Change History
[CHANGELOG](CHANGELOG)

## License

[MIT](LICENSE)
