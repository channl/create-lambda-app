/* @flow */
import { handler } from '../src/index';
import createLambdaCallbackPromise
  from 'lambda-dev-utils/createLambdaCallbackPromise';

// $FlowIgnore
it('handler works', async () => {
  const event = {};
  const context = {
    getRemainingTimeInMillis: () => {
      return 0;
    },
    awsRequestId: '012345',
    callbackWaitsForEmptyEventLoop: false,
    clientContext: {},
    functionName: 'MyTestFunction',
    functionVersion: '1.0.0',
    identity: null,
    invokedFunctionArn: 'ARN012345',
    logGroupName: 'MyTestFunctionLogGroup',
    logStreamName: 'MyTestFunctionLogStream',
    memoryLimitInMB: 125,
  };

  // Invoke the lambda function
  const { callback, promise } = createLambdaCallbackPromise();
  handler(event, context, callback);

  const result = await promise;
  const expectedResult = null;

  // $FlowIgnore
  expect(result).toEqual(expectedResult);
});
