"use strict";

const cache = new Map();

function get(key){
    return cache.get(key);
}

function set(key, value){
    cache.set(key, value);
}

module.exports = {
    get,
    set
};
