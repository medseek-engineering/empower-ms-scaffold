#!/usr/bin/env node
var program = require('commander');

var fs = require('fs');

var ncp = require('ncp').ncp;

var replace = require("replace");

ncp.limit = 16;
  
program
  .version('1.0.0')

var templateLocation = './serviceScaffold';
var microServiceLocation ='./services';

var fileList = []

var replaceValues=[]

function readSettings(){

  var config = require('../../scaffold.json');

  fileList =[];
  replaceValues =[];

  config.fileList.forEach(function(file){
    fileList.push(file)
  });

 config.replaceValues.forEach(function(file){
    replaceValues.push(file)
  });

 templateLocation = config.templateLocation;
 microServiceLocation = config.microServiceLocation;

}

function updateNewMicroService(microServiceName){

  fileList.forEach(function(file){
    replaceValues.forEach(function (replaceVal){
       replace({
        regex: '{%='+replaceVal.paramName+'%}',
        replacement: getReplaceValue(replaceVal),
        paths: [buildNewMicroserviceFile(microServiceName,file.fileName)],
        recursive: true,
        silent: true,
    });
    })

    replaceFile(microServiceName,file);
   
})

function buildNewMicroserviceFile(microServiceName,fileName){
  return microServiceLocation+'/'+microServiceName+ '/'+fileName
}

function isCommandValue(replaceVal){
  return (typeof(replaceVal.isCommandParam) != 'undefined' && replaceVal.isCommandParam === 'true');
}

function getReplaceValue(replaceVal){
  if(isCommandValue(replaceVal)){
    return process.argv[replaceVal.commandIndex];
  }else{
    return replaceVal.paramValue;
  }
  
}

function getFileExtension(fileName){
  return fileName.split('.').pop();
}

function replaceFile(microServiceName,file){
   if(typeof(file.replaceFileName) != 'undefined' && file.replaceFileName === 'true'){
    //renmame template
    var existingfile = microServiceLocation + '/'+microServiceName + '/'+ file.fileName;
    var newFile = microServiceLocation +'/'+ microServiceName+ '/'+ microServiceName+'.'+getFileExtension(file.fileName)
    fs.rename(existingfile,newFile , function(err) {
      if ( err ) console.log('ERROR: ' + err);
    }); 
  }
}

}



program
  .command('*')
  .action(function(env){
    readSettings();

  if(process.argv[2].length < 1 || typeof(process.argv[2]) === 'undefined'){
    console.log("Please provide a module name");
    return;
  }
 console.log('Here ');
  var microServiceName = process.argv[2];

  ncp(templateLocation,microServiceLocation +'/'+ microServiceName, function (err) {
    if (err) {
       return console.error(err);
     }
     else{
      updateNewMicroService(microServiceName);
     }
     console.log('Microservice Created :) ');
  }
  );

});


program.parse(process.argv);