const ONE_SECOND = 1000;
const TWO_SECONDS = 2000;
const THREE_SECONDS = 3000;

const CREATE_ERROR = process.env.CREATE_ERROR == "true";

const delayLog1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1 - after three seconds");
      resolve();
    }, THREE_SECONDS);
  });
};

const delayLog2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("2 - after two seconds");
      if (CREATE_ERROR) {
        reject(Error("arbitrary issue"));
      } else {
        resolve();
      }
    }, TWO_SECONDS);
  });
};

const delayLog3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("3 - after one seconds");
      resolve();
    }, ONE_SECOND);
  });
};

const invokeWithoutAsyncAwait = () => {
  delayLog1().then(
    (result) => {
      delayLog2().then(
        (result) => {
          delayLog3().then(
            (result) => {
              console.log("Finished invoking without async/await.");
            },
            (error) => {
              console.log("--- ERROR in PROMISE: 3 ---");
            }
          );
        },
        (error) => {
          console.log("--- ERROR in PROMISE: 2 ---");
        }
      );
    },
    (error) => {
      console.log("--- ERROR in PROMISE: 1 ---");
    }
  );
};

const invokeWithAsyncAwait = async () => {
  try {
    await delayLog1();
    await delayLog2();
    await delayLog3();
    console.log("Finished invoking with async/await.");
  } catch (err) {
    console.log("--- ERROR in ASYNC/AWAIT ---");
  }
};

invokeWithoutAsyncAwait();
invokeWithAsyncAwait();
