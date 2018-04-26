// Config for fileupload
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
    checkCreateDirectories: true, //create the directories for you
  	getFileName: function(file, formData) {

  		var fileExtension = file.name.substr((file.name.lastIndexOf('.') + 1));
  		return new Date().getTime() + '-' + Math.floor((Math.random() * 10000) + 1) + '.' + fileExtension; 
  }
  });
});