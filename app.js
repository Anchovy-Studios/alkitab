const fs = require('fs')
const semver  = require('semver');
const { execSync } = require('child_process');
const path = require('path')

class Alkitab {
    #data;
    #daftarKitab;
    #error;
    #chapterEn;
    #errorFile;

    constructor() {
        this.#data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data') ,{encoding:'utf8', flag:'r'}))
        this.#chapterEn = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapter-en') ,{encoding:'utf8', flag:'r'}))
        this.#daftarKitab = Object.keys(this.#data)
        this.#errorFile = this.#parseTime(new Date(new Date().toLocaleDateString()).getTime()) + '.log'
        this.#error = new Array()
        this.#createLogDir()
    }

    #parseTime = (millis) => {
        let length = millis.toString().length
        millis = (Math.floor(millis/ (1000.0*60.0*60.0*24.0)))
        let result = millis + ''
        for (let i = result.length; i < length; i++) {
            result += '0'
        }
        return result
    }

    #createLogDir = () => {
        if (!fs.existsSync(path.join(__dirname, 'logs'))){
            fs.mkdirSync(path.join(__dirname, 'logs'));
        }
    }

    #bookCheck = (book) => {
        return this.#daftarKitab.includes(book)
    }

    #parseVerse = (book, chapter, verse) => {
        if (this.#bookCheck(book)) {
            if (chapter) {
                if (chapter < 0) throw new AlkitabException('Chapter must be positive number!', 'Negative number passed as chapter param!', this.#errorFile)

                let result = this.#data[book].chapter[(chapter-1)]
                if (!result) {
                    throw new AlkitabException(`Chapter not found!`, 'The chapter param number is bigger than the maxsimum chapter in book ' + book + '.', this.#errorFile)
                }
                if (!verse) return result
                else {
                    if (verse < 0) throw new AlkitabException('Verse must be positive number!', 'Negative number passed as verse param!', this.#errorFile)

                    result = this.#data[book].chapter[(chapter-1)][(verse-1)]
                    if (!result) {
                        throw new AlkitabException(`Verse not found!`, 'The verse param number is bigger than the maxsimum verse in book ' + book + ' ' + chapter + '.', this.#errorFile)
                    }
                    return result
                }
            } else {
                throw new AlkitabException(`Failed to convert the chapter into number!`, 'Chapter format invalid!', this.#errorFile)
            }
        } else {
            throw new AlkitabException(`We're sorry we can not find the book of ${book} in our database. Please check again the book list on our home page or use Alkitab.getBookList() static method.`, 'Book not found!', this.#errorFile)
        }
    }

    getVerseByOptions(options) {
        return this.#parseVerse(options && options['fromEn'] ? this.#chapterEn[options['book']] : options['book'], options['chapter'], options['verse'])
    }

    getVerse(book, chapter, verse, options) {
        if (options && options['fromEn']) {
            book = this.#chapterEn[book]
        }
        return this.#parseVerse(book, chapter, verse)
    }

    getVerseByQuery(query, options) {
        let book = query.substring(0, query.lastIndexOf(" ")).trim()
        if (options && options['fromEn']) {
            book = this.#chapterEn[book]
        }
        let temp = query.substring(query.lastIndexOf(" ")).trim().split(":")
        let chapter = undefined
        let verse = undefined
        if (temp.length == 1) {
            chapter = parseInt(temp)
        } else {
            chapter = parseInt(temp[0].trim())
            verse = parseInt(temp[1].trim())
        }

        return this.#parseVerse(book, chapter, verse)
    }

    /**
     * @deprecated since version 0.1.0.
     * Will be deleted in version 0.2.0.
     * 
     * Now it will return an empty array.
     * All error will be thrown immediately and stored in
     * particular error file each day.
     */
    getInstanceError() {
        return this.#error
    }

    clearErrors(maxTime = this.#parseTime(new Date(new Date().toLocaleDateString()).getTime())) {
        const results = new Array()
        const files = fs.readdirSync(path.join(__dirname, 'logs'))
        for (let i = 0; i < files.length; i++) {
            if (parseInt(files[i].substring(0, files[i].length-4)) <= maxTime) {
                
                fs.unlinkSync(path.join(__dirname, 'logs', files[i]))
                results.push(files[i])
            }
        }

        return results
    }

    getErrors(formatted = false, time = new Date(new Date().toLocaleDateString()).getTime()) {
        const result = new Array()
        const file = this.#parseTime(time) + '.log'
        const data = fs.readFileSync(path.join(__dirname, 'logs', file) , {encoding:'utf8', flag:'r'}).split('\n');
        let temp;
        for(let i = 0; i < data.length; i++) {
            if (formatted) {
                if (data[i] == '') continue;
                temp = data[i].split(' | ')
                result.push(new AlkitabException(temp[1], temp[2].substring(7), undefined, temp[3].substring(14), temp[0], false))
            } else {
                result.push(data[i])
            }
        }
        return result
    }

    static getBookList(sorted = false) {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data') ,{encoding:'utf8', flag:'r'}))

        if (sorted) {
            const result = Object.keys(data).sort(function(a,b){return data[a].index-data[b].index})
            return result
        } else {
            return Object.keys(data)
        }
    }

    static getVersion(log = false) {
        if (log) console.log("\x1b[47m\x1b[30mChecking npm registry ...\x1b[0m")
        const latestVersion = execSync('npm show @anchovy_studios/alkitab version').toString().trim()
        const pkgVersion = require('./package.json').version;
        let result = `Hi ^-^\nYour current version is ${pkgVersion}.\n`

        if(semver.gt(latestVersion, pkgVersion)) {
            result = result + `The latest version is \x1b[33m${latestVersion}\x1b[0m. Consider updating your library with \x1b[32mnpm install\x1b[0m command.`
            if (log) console.log(result)
            else return { current: pkgVersion, latest: latestVersion, message: result}
        } else {
            result = result + 'Good job! This is the latest version.'
            if (log) console.log(result) 
            else return { current: pkgVersion, latest: latestVersion, message: result}
        }
    }

}

class AlkitabException extends Error {
    #nativeMsg;
    #when;
    #cause;
    #errorFile;

    constructor(message, cause, errorFile, nativeMsg, when, writeError = true) {
        super(message)
        super.name = this.constructor.name
        this.#cause = cause
        this.#nativeMsg = nativeMsg
        this.#errorFile = errorFile

        if (when)
            this.#when = when
        else
            this.#when = new Date().toLocaleString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})

        if (writeError) this.#writeErrorLog()

        this.message = this.toString()
    }

    #formatErrorLog = () => {
        return `${this.#when} | ${this.message} | Cause: ${this.#cause} | Native error: ${this.#nativeMsg}\n`
    }

    #writeErrorLog = () => {
        fs.writeFileSync(path.join(__dirname, 'logs', this.#errorFile), this.#formatErrorLog(), {flag: 'a'})
    }

    toString() {
        return `\n\x1b[41m\x1b[37mOopps!! Error detected!!\x1b[0m\n${this.message}\n\x1b[31mCause: \x1b[0m${this.#cause}\n\x1b[31mNative error: \x1b[0m${this.#nativeMsg}\n\x1b[31mTime: \x1b[0m${this.#when}\x1b[0m\n`
    }
}

module.exports.Alkitab = Alkitab;