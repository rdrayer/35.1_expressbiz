process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { describe } = require('node:test');

let testCompany;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description)
    VALUES ('code', 'name', 'description1')
    RETURNING code, name, description`)
    testCompany = result.rows[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end();
})

describe("hope this works", () => {
    test('blah', () => {
        console.log(testCompany);
        expect(1).toBe(1);
    })
})

afterAll(async () => {
    await db.end();
})

describe('GET /companies', () => {
    test('get a list with one company', async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: [testCompany]})
    })
}) 