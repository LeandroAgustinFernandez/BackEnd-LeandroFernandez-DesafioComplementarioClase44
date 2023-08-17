export const getLogs = (request, response)=> {
  request.logger.fatal(`FATAL => ${new Date()} - LoggerType: fatal`);
  request.logger.error(`ERROR => ${new Date()} - LoggerType: error`);
  request.logger.warning(`WARNING => ${new Date()} - LoggerType: warning`);
  request.logger.info(`INFO => ${new Date()} - LoggerType: info`);
  request.logger.http(`HTTP => ${new Date()} - LoggerType: http`);
  request.logger.debug(`DEBUG => ${new Date()} - LoggerType: debug`);
  response.send({state: 'Log view test'});
}