let Epub = require("epub")
let epub = new Epub("./ulysses.epub")
let Tokenizer = require("sentence-tokenizer")
let tokenizer = new Tokenizer("Chuck")
let syllable = require("syllable")
let rhyme = require('rhyme-plus')

let getAllChapters = callback => {
    epub.on("end", () => {
        epub.flow.forEach(chapter => {
            epub.getChapter(chapter.id, (error, text) => {
                callback(text, error)
            })
        })
    })
}

let getAllSentences = source => callback => {
    source(value => {
        tokenizer.setEntry(value)
        callback(tokenizer.getSentences())
    })
}

let limitSentencesBySyllable = count => source => callback => {
    source(value => {
        callback(value.filter(sentence => {
            let syllables = syllable(sentence)

            return syllables === count
        }))
    })
}

let getLastWords = source => callback => {
    source(value => {
        value.map(sentence => {
            let words = sentence.split(" ")
            let lastWord = words[words.length - 1].replace(/[^\w\s]/gi, '')
            callback(lastWord)
        })
    })
}

let findRhymes = source => callback => {
    source(value => {
        rhyme(r => {
            callback(r.findRhymes(value))
        })
    })
}

let logValue = value => {
    console.log(value)
}


let getAllRhymes = findRhymes(getLastWords(limitSentencesBySyllable(6)(getAllSentences(getAllChapters))))

getAllRhymes(logValue)

epub.parse()