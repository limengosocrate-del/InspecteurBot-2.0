"use strict";

function rank(queryVec, docVec, cosineScore){

    const textScore = cosineScore;

    const lengthBoost = Math.min(docVec.words.length / 120, 1);

    return (textScore * 0.7) + (lengthBoost * 0.3);
}

module.exports = { rank };
