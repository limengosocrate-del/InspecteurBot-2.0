"use strict";

function normalize(text){
    if(!text) return "";

    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(text){
    return normalize(text)
        .split(" ")
        .filter(w => w.length > 2);
}

module.exports = {
    normalize,
    tokenize
};
