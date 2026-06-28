"use strict";

const { cosine } = require("../pipeline/similarity");
const { rank } = require("../pipeline/ranking");

function search(queryVec, docs){

    const results = [];

    docs.forEach(doc => {

        const score = cosine(queryVec.vector, doc.vector);

        results.push({
            id: doc.id,
            doc: doc.doc,
            score: rank(queryVec, doc, score)
        });

    });

    return results.sort((a, b) => b.score - a.score);
}

module.exports = { search };
