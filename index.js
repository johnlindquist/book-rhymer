let Epub = require("epub")
let epub = new Epub("./ulysses.epub")
let Tokenizer = require("sentence-tokenizer")
let tokenizer = new Tokenizer("Chuck")
let syllable = require("syllable")
let rhyme = require('rhyme-plus')

let getChapter = callback => {

}


epub.on("end", function () {
    // let ids = epub.toc.map((content) => content.href)
    // console.log(ids)

    // epub.getChapter("np-1", (error, text) => {
    //     console.log(text)
    // })

    console.log(epub.flow)

    epub.flow.forEach((chapter) => {
        console.log("->", chapter.id)
        epub.getChapter(chapter.id, (error, text) => {
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
    })
})

epub.parse()