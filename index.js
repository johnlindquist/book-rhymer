let Epub = require("epub")
let epub = new Epub("./ulysses.epub")
let Tokenizer = require("sentence-tokenizer")
let tokenizer = new Tokenizer("Chuck")
let syllable = require("syllable")
let rhyme = require('rhyme-plus')

let getAllChapters = epub => callback => {
    epub.on("end", () => {
        epub.flow.forEach(chapter => {
            epub.getChapter(chapter.id, (error, text) => {
                callback(text, error)
            })
        })
    })
}

getAllChapters(epub)(text => {
    tokenizer.setEntry(text)

    let sentences = tokenizer.getSentences().filter(sentence => {
        let syllables = syllable(sentence)

        return syllables === 6
    })

    let lastWords = sentences.map(sentence => {
        let words = sentence.split(" ")
        return words[words.length - 1].replace(/[^\w\s]/gi, '')
    })
    // console.log(lastWords)
    rhyme(r => {
        console.log(r.findRhymes(lastWords))
    })
})

epub.parse()