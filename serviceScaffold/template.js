'use strict';

var crutch = require('microservice-crutch');

var defaults = {
    id: '{%=name%}',
    defaultExchange: 'topic://medseek-api',
    defaultQueue: '{%=name%}',
    defaultReturnBody: true,
    communicateDb: 'MedseekIntegration60',
    pageSize: '20'
};

module.exports = crutch(defaults, function(app, logging, microservices, bluebird, options, url, _, util, Promise) {

 	var log = logging.getLogger(defaults.id);

   

});
