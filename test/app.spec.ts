import { expect } from 'chai';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import app from '../src/app';
import { errorHandler } from '../src/app.hooks';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string =>
  url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname,
  });

describe('Feathers application tests', () => {
  let server: Server;

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function (done) {
    server.close(done);
  });

  it('starts and shows the index page', async () => {
    const { data } = await axios.get(getUrl());

    expect(data.indexOf('<html lang="en">')).to.not.eq(-1);
  });

  describe('404', function () {
    it('shows a 404 HTML page', async () => {
      let err;
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            Accept: 'text/html',
          },
        });
      } catch (error: any) {
        const { response } = error;
        err = response;
      }

      expect(err).to.exist;
      expect(err.status).to.eq(404);
      expect(err.data.indexOf('<html>')).to.not.eq(-1);
    });

    it('shows a 404 JSON error without stack trace', async () => {
      let err;

      try {
        await axios.get(getUrl('path/to/nowhere'));
      } catch (error: any) {
        const { response } = error;
        err = response;
      }

      expect(err.status).to.eq(404);
      expect(err.data.code).to.eq(404);
      expect(err.data.message).to.eq('Page not found');
      expect(err.data.name).to.eq('NotFound');
    });
  });

  describe('default errorHandler', () => {
    it('should do nothing if there are no errors', () => {
      expect(errorHandler({} as any)).to.be.undefined;
    });

    it('should return the given context if there are errors', () => {
      const context = { error: new Error('test') };
      expect(errorHandler(context as any)).to.eql(context);
    });
  });
});
