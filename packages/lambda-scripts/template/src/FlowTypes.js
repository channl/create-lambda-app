/* @flow */
export type LambdaContext = {
  callbackWaitsForEmptyEventLoop: boolean,
  functionName: string,
  functionVersion: string,
  invokedFunctionArn: string,
  memoryLimitInMB: number,
  awsRequestId: string,
  logGroupName: string,
  logStreamName: ?string,
  identity: ?Object,
  clientContext: ?Object,
  getRemainingTimeInMillis(): number,
};

export type LambdaCallbackFunc = (error: ?Error, result: ?Object) => void;
