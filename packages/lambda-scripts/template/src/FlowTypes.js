/* @flow */
export type LambdaContext = {
  callbackWaitsForEmptyEventLoop: any;
  functionName: string;
  functionVersion: any;
  invokedFunctionArn: any;
  memoryLimitInMB: any;
  awsRequestId: any;
  logGroupName: any;
  logStreamName: any;
  identity: any;
  clientContext: any;
  getRemainingTimeInMillis(): number;
};

export type LambdaCallbackFunc = (error: ?Error, result: ?Object) => void;
