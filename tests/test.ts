import fs from 'fs';
import {describe, expect, test} from '@jest/globals';
import {parseModule} from "../src/parser";
import  * as types from "../src/types";
import  {WASMSectionID} from "../src/types";
import {decodeSignedLeb128 as lebToInt} from "../src/Leb128ToInt"
import * as bp from "../src/bodyParser";
import * as descParser from "../src/helperParser";

// const test = new Uint8Array(fs.readFileSync('../tests/arrays.wasm'));
// console.log(JSON.stringify(parseModule(test), null, 1))
//npm install --save-dev ts-jest
//npm install @types/jest
//npx ts-jest config:init
//npx jest

describe("parseImport", () => {
    test("parseImport section from arrays.wasm", () => { 
        const importTest = new Uint8Array([0x01, 0x07, 0x69, 0x6D, 0x70, 0x6F, 0x72, 0x74, 0x73, 0x0B, 0x72, 0x65, 0x64, 0x75, 0x63, 0x65, 0x5F, 0x66, 0x75, 0x6E, 0x63, 0x00, 0x02]);
        let result = bp.parseImport(importTest, 0);
        expect(result).toEqual(
            [
                {
                  module: [ 7, 'imports' ],
                  name: [ 11, 'reduce_func' ],
                  description: 2
                }
              ]
        )

    })
})
describe("parseFunction", () =>{
    test("parseFunction section from arrays.wasm", ()=>{
        const functionTest = new Uint8Array([0x0A, 0x00, 0x00, 0x02, 0x03, 0x02, 0x04, 0x00, 0x04, 0x02, 0x02]);
        let result = bp.parseFunction(functionTest, 0);
        expect(result).toEqual(
            [0,0,2,3,2,4,0,4,2,2]
        )
    })
})
describe("parseTable", () =>{

})

describe("parseMemory", ()=>{
    //limits array
    test("parseMemory section from arrays.wasm", () => {
        const memory = new Uint8Array([0x01, 0x00, 0x01]);
        let result = bp.parseMemory(memory, 0);
        expect(result).toEqual(
           [{
            flag: 0,
            min: 1
           }]
        )
    })
})
describe("descParser.parseLimits", () => {
    test("parselimit flag 1", () => {
        const limit = new Uint8Array([0x01, 0x01, 0x02]);
        let result = descParser.parseLimits(limit, 0);
        expect(result).toEqual(
           [{
            flag: 1,
            min: 1,
            max: 2
           }, 3]
        )
        
    })
    test("parselimit flag 0", () => {
        const limit = new Uint8Array([0x00, 0x04]);
        let result = descParser.parseLimits(limit, 0);
        expect(result).toEqual(
           [{
            flag: 0,
            min: 4
           }, 2]
        )
    })
})
describe("descParser.parseGlobalType", () => {
    let globalTypes = [0x7F , 0x7E , 0x7D , 0x7C, 0x70, 0x6f, 0x7B];
    for(let gt of globalTypes) {
        test(`parseglobaltype valtype ${gt.toString(16)} as val`, () => {
            const global = new Uint8Array([gt, 0x01]);
            let result = descParser.parseGlobalType(global, 0);
            expect(result).toEqual(
                [{
                    valtype: gt,
                    mutability: 1
                }, 2]
            )
        })
    }
    test("parseglobaltype invalid valtype", () => {
        const global = new Uint8Array([0x7A, 0x01]);
        expect(() => {
            descParser.parseGlobalType(global, 0);
        }).toThrowError(new Error("Invalid valType."))
    })

    test("parseglobaltype invalid mutability", () => {
        const global = new Uint8Array([0x7F, 0x03]);
        expect(() => {
            descParser.parseGlobalType(global, 0);
        }).toThrowError(new Error("Invalid mutability."))
    })
})

describe("parseExport", ()=>{
    test("parseExport section from arrays.wasm", ()=>{
        const exports = new Uint8Array([0x06, 0x05, 0x61, 0x72, 0x72, 0x61, 0x79, 0x00, 0x07, 0x03, 0x67, 
        0x65, 0x74, 0x00, 0x05, 0x06, 0x6C, 0x65, 0x6E, 0x67, 0x74, 0x68, 0x00, 0x02, 0x05, 0x72, 0x61, 
        0x6E, 0x67, 0x65, 0x00, 0x09, 0x06, 0x72, 0x65, 0x64, 0x75, 0x63, 0x65, 0x00, 0x0A, 0x06, 0x6D, 
        0x65, 0x6D, 0x6F, 0x72, 0x79, 0x02, 0x00, 0x0A, 0xA6, 0x02]); //last 3 are out of section, just for the sake of testing

        let result = bp.parseExport(exports, 0);
        console.log(result);
        // expect(result).toEqual(
            
        // )
    })

})


// console.log(Array.prototype.slice.call(test).map(byte=>byte.toString(16)))

// const dv:DataView = new DataView(test);
// console.log(dv)