"use strict";

const { tokenize } = require("./preprocessing");

function buildVector(doc){

    const words = tokenize(
        (doc.titre || "") + " " +
        (doc.contenu || "") + " " +
        (doc.resume || "")
    );

    const vector = {};

    words.forEach(w => {
        vector[w] = (vector[w] || 0) + 1;
    });

    return {
        id: doc.numero,
        vector,
        words,
        doc
    };
}

module.exports = { buildVector };
