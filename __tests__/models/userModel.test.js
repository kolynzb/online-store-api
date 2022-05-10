const TestHelpers = require('../TestHelpers');

beforeAll(async () => await TestHelpers.connect());
afterEach(async () => await TestHelpers.clearDb());
afterAll(async () => await TestHelpers.closeDb());

describe('First Group Of Tests', () => {
    it('First Test', async done => {
        const result = await numberFunc(10)
        expect(result.word).toBe("ten")
        expect(result.number).toBeGreaterThan(10)
        done()
    })
    it('Second Test', async done => {
        const result = await numberFunc()
        expect(result).toBeNull()
        done()
    })
})