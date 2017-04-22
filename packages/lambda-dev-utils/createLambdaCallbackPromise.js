'use strict';

function createLambdaCallbackPromise() {
  var tmp = {
    resolve: null,
    reject: null,
  };

  var result = {
    promise: new Promise((resolve, reject) => {
      tmp.resolve = resolve;
      tmp.reject = reject;
    }),
    callback: (error, result) => {
      if (error) {
        tmp.reject(error);
        return;
      }

      tmp.resolve(result);
    },
  };

  return result;
};


module.exports = createLambdaCallbackPromise;
