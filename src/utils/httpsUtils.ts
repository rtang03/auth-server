import { promises as fs } from 'fs';
import http from 'http';
import https from 'https';
import util from 'util';

export const IS_HTTPS = '_is_Using_Https';

export const getHttpsServerOption = ({
  options, certPath, certKeyPath, mock = false
} : {
  options?: http.ServerOptions | https.ServerOptions;
  certPath?: string;
  certKeyPath?: string;
  mock?: boolean;
}): Promise<http.ServerOptions | https.ServerOptions | undefined> => {
  return new Promise<http.ServerOptions | https.ServerOptions | undefined>(async (resolve, _) => {
    if (certPath && certKeyPath) {
      let cert: Buffer;
      try {
        cert = await fs.readFile(certPath);
      } catch (e) {
        if(e.code === 'ENOENT') {
          resolve(options); // not https
          return;
        } else {
          throw new Error(util.format('fail to access cert file %j', e));
        }
      }

      let key: Buffer;
      try {
        key = await fs.readFile(certKeyPath);
      } catch (e) {
        if(e.code === 'ENOENT') {
          resolve(options); // not https
          return;
        } else {
          throw new Error(util.format('fail to access key file %j', e));
        }
      }

      const result: https.ServerOptions = {
        key, cert
      };
      if (options) Object.assign(result, options);
      resolve(mock ? {} : result); // is https
      return;
    }
    resolve(options); // not https
  });
};
