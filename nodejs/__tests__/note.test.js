var request = require("request");

describe('test note controller', () => {

    test('test home page', () => {
        request.get('http://localhost:4000/', function(error, response, body) {
            expect(response.statusCode).toEqual(200);
        });
    });

    test('test expect error when title is missing in add note', () => {
        request.post({url:'http://localhost:4000/add-note', form: {
                note: 'abc'
            }}, function(error, response, body) {
                
                let res = JSON.parse(body);
                expect(res.code).toEqual(412);
        });
    });

    test('test expect error when note is missing', () => {
        request.post({url:'http://localhost:4000/add-note', form: {
                title:'abc'
            }}, function(error, response, body) {
                let res = JSON.parse(body);
                expect(res.code).toEqual(412);
        });
    });
    
    test('test insert note', () => {
        request.post({url:'http://localhost:4000/add-note', form: {
                title: 'abc', note: 'xyz'
            }}, function(error, response, body) {
                let res = JSON.parse(body);
                expect(res.code).toEqual(200);
        });
    });

    test('test update note', () => {
        request.post({url:'http://localhost:4000/add-note', form: {
                id: 1, title: 'abc1', note: 'xyz1'
            }}, function(error, response, body) {
                let res = JSON.parse(body);
                expect(res.code).toEqual(200);
        });
    });
});