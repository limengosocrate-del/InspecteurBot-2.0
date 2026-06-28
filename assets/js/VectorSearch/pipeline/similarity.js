"use strict";

function cosine(a, b){

    let dot = 0;
    let magA = 0;
    let magB = 0;

    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    keys.forEach(k => {
        const va = a[k] || 0;
        const vb = b[k] || 0;

        dot += va * vb;
        magA += va * va;
        magB += vb * vb;
    });

    if(!magA || !magB) return 0;

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

module.exports = { cosine };
