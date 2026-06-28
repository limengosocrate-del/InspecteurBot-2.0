"use strict";

const VectorSearchAPI = require("./api/VectorSearchAPI");

function createVectorSearch(database){

    const engine = VectorSearchAPI(database);

    return {
        search: engine.search
    };
}

module.exports = createVectorSearch;
