/* eslint no-unused-expressions: 0 */
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const { expect } = chai;

let expressMock;
let routes;
let double;

describe('double', () => {
  beforeEach(() => {
    expressMock = { Router: sinon.stub() };
    routes = { get: sinon.stub(), stack: [] };

    expressMock.Router.returns(routes);
    double = proxyquire('./double', { express: expressMock });
  });

  describe('#mock', () => {
    it('creates an express route with the defined method and path', () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
        },
      ];
      double.setDefinitions(definitions);
      double.mock('hello');
      expect(routes.get).to.have.been.calledWith(definitions[0].path);
    });

    it('executes the handler callback with express request and response args', () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
          handler: (req, res) => { req(); res(); },
        },
      ];

      double.setDefinitions(definitions);
      const req = sinon.spy();
      const res = sinon.spy();
      routes.get.callsArgWith(1, req, res);
      double.mock('hello');
      expect(req).to.have.been.called;
      expect(res).to.have.been.called;
    });

    it('executes the handler callback with options arg', () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
          handler: (req, res, options) => options(),
        },
      ];

      double.setDefinitions(definitions);
      const options = sinon.spy();
      routes.get.callsArg(1);
      double.mock('hello', options);
      expect(options).to.have.been.called;
    });

    it('removes existing express router with the same path', () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
        },
      ];

      routes.stack = [
        { route: { path: '/hello' } },
      ];

      double.setDefinitions(definitions);
      double.mock('hello');
      expect(routes.stack).to.deep.equal([]);
    });

    context('with request parameters', () => {
      it('does not apply state if request parameters mismatch', () => {
        const definitions = [
          {
            name: 'login',
            path: '/login',
            parameters: [
              {
                name: 'auth',
                in: 'body',
              },
            ],
            method: 'get',
            handler: (req, res, options) => options(),
          },
        ];

        double.setDefinitions(definitions);
        const options = sinon.spy();
        const req = { body: { username: 'Nayne' } };
        routes.get.callsArgWith(1, req, null);
        double.mock('login', options, { auth: { username: 'maria' } });
        expect(options).to.not.have.been.called;
      });

      it('applies state if request parameters match', () => {
        const definitions = [
          {
            name: 'login',
            path: '/login',
            parameters: [
              {
                name: 'auth',
                in: 'body',
              },
            ],
            method: 'get',
            handler: (req, res, options) => options(),
          },
        ];

        double.setDefinitions(definitions);
        const options = sinon.spy();
        const req = { body: { username: 'maria' } };
        routes.get.callsArgWith(1, req, null);
        double.mock('login', options, { auth: { username: 'maria' } });
        expect(options).to.have.been.called;
      });
    });
  });
});
