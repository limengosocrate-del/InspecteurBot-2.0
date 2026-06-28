"use strict";

let Base = [];
let Index = [];
let Vectors = [];

let State = "idle";

function setState(s){
    State = s;
}

module.exports = {
    Base,
    Index,
    Vectors,
    State,
    setState
};
