let Epub = require("epub")
let epub = new Epub("./ulysses.epub")
let Tokenizer = require("sentence-tokenizer")
let tokenizer = new Tokenizer("Chuck")
let syllable = require("syllable")
let rhyme = require('rhyme-plus')

let getAllChapters = callback => {
    console.log("getAllChapters")
    epub.on("end", () => {
        epub.flow.forEach((chapter, i) => {
            // if (i > 3) return
            epub.getChapter(chapter.id, (error, text) => {


                callback(text, error)


            })

        })
    })
}

let map = transform => source => callback => {
    console.log("map")
    source(value => {
        callback(transform(value))
    })
}

let getAllSentences = source => callback => {
    console.log("getAllSentences")
    source(value => {
        tokenizer.setEntry(value)
        callback(tokenizer.getSentences())
    })
}

let limitSentencesBySyllable = count => source => callback => {
    console.log("limitSentencesBySyllable")
    source(value => {
        callback(value.filter(sentence => {
            let syllables = syllable(sentence)

            return syllables === count
        }))
    })
}

let getLastWords = source => callback => {
    console.log("getLastWords")
    source(value => {
        callback(value.map(sentence => {
            let words = sentence.split(" ")
            let lastWord = words[words.length - 1].replace(/[^\w\s]/gi, '')

            return lastWord
        }))
    })
}

let findRhymes = source => callback => {
    console.log("find rhymes")
    source(value => {
        rhyme(r => {
            callback(r.findRhymes(value))
        })
    })
}

let logValue = value => {
    console.log(value)
}

let compose = (...fns) =>
    fns.reduceRight((prevFn, nextFn) =>
        (...args) => nextFn(prevFn(...args)),
        value => value
    );

let limitTo6Syllables = limitSentencesBySyllable(6)

// findRhymes(getLastWords(limitTo6Syllables(getAllSentences(getAllChapters))))(logValue)

let operate = compose(
    findRhymes,
    getLastWords,
    filterByRhymes,
    limitTo6Syllables,
    getAllSentences
)

operate(getAllChapters)(logValue)

epub.parse()