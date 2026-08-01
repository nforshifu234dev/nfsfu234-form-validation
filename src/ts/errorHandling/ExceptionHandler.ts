const LogLevelInterface = {
    ERROR: 'error',
    ERROR_1: 'error_1',
    CONSOLE: 'console',
    THROW: 'throw',
    WARNING: 'warning',
    INFO: 'info',
  };
  
const ExceptionHandler = (error: any, level: string = LogLevelInterface.CONSOLE) => {
    switch (level) {

      case LogLevelInterface.ERROR:
        // You can customize error handling here
        console.error('Error:', error);
        // throw error;
        // continue;
        break;

      case LogLevelInterface.ERROR_1:
        // Hard validation errors: log and stop execution.
        console.error('Error:', error);
        throw error;

      case LogLevelInterface.CONSOLE:
        // You can customize error handling here
        console.error('Error:', error);
        break;

      case LogLevelInterface.THROW:
        throw error;

      case LogLevelInterface.WARNING:
        // You can customize warning handling here
        console.warn('Warning:', error);
        break;

      case LogLevelInterface.INFO:
        // You can customize info handling here
        console.log('Info:', error);
        break;

      default:
        // console.log("default");
        
        // Default behavior is to treat as an error
        console.error('Error:', error);
        throw error;
    }
  };
  
  export { ExceptionHandler, LogLevelInterface };
  