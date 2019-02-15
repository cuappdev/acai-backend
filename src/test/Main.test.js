const request = require('supertest');
const bodyParser = require('body-parser');
const AppDevAPI = require('../AppDevAPI').default;
const AppDevUtilities = require('../AppDevUtilities').default;
const AppDevRouter = require('../AppDevRouter').default;
const ChronicleSession = require('../ChronicleSession').default;
const RegisterSession = require('../RegisterSession').default;


const helloWorldRouter = class HelloWorldRouter extends AppDevRouter<string> {
    constructor() {
        super('GET');
    }

    getPath(): string {
        return '/';
    }

    async content(req: Request): Promise<string> {
        const checkInit = (req.query.awaitInit !== undefined && `${await init}.`) || process.env.PORT;

        return ('Hello World!');
    }
};

const testAPI = class testAPI extends AppDevAPI {
    getPath(): string {
        return '/api/v1/';
    }

    middleware(): Array<any> {
        return [
            bodyParser.json(),
        ];
    }

    routers(): Array<Router> {
        return [
        ];
    }
};

describe('AppDevAPI', () => {
    let API;
    let server;
    let express;

    test('new API', () => {
        API = new testAPI();
    });
    test('getServer', () => {
        server = API.getServer(false);
    });
    test('express', () => {
        express = API.express;
        expect(express).toBeTruthy();
    });
});

describe('AppDevRouter', () => {
    test('new helloWorldRouter', () => {
        const testRouter = new helloWorldRouter();
    });
});

describe('AppDevUtilities', () => {
    test('tryCheckAppDevURL', () => {
        AppDevUtilities.tryCheckAppDevURL('/')
    })
});

describe('ChronicleSession', () => {
    test('new', () => {
        const chronicle = new ChronicleSession();
    })
});

describe('RegisterSession', () => {
    test('new', () => {
        const chronicle = new RegisterSession();
    })
});
