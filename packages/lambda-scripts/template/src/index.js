/* @flow */
import type { LambdaContext, LambdaCallbackFunc } from './FlowTypes';
import App from './App';

exports.handler = async (event: Object, context: LambdaContext, callback: LambdaCallbackFunc) => {
  try {
    const app = new App();
    const result = await app.runAsync();
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};
