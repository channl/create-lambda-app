/* @flow */
import { handler } from '../src/index';
import createLambdaCallbackPromise from 'lambda-dev-utils/createLambdaCallbackPromise';

it('handler works', async () => {
  const event = {};
  const context = {};

  // Invoke the lambda function
  const { callback, promise } = createLambdaCallbackPromise();
  handler(event, context, callback);

  const result = await promise;
  const expectedResult = null;
  expect(result).toEqual(expectedResult);
});
