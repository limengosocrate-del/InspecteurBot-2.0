"use strict";

const Cache = require("../cache/cache");
const { buildVector } = require("../pipeline/vectors");
const { search } = require("../engine/search");

function VectorSearchAPI(database){

    function query(text){

        const cached = Cache.get(text);
        if(cached) return cached;

        const queryVec = buildVector({ contenu: text });

        const docs = database.map(buildVector);

        const results = search(queryVec, docs);

        Cache.set(text, results);

        return results;
    }

    return {
        search: query
    };
}

module.exports = VectorSearchAPI;
