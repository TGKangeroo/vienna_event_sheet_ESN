function uploadFiles() {

  try {
    /* Find the first level folder, create if the folder does not exist */
    var firstLevelFolderName = "UW_events";
    var folders = DriveApp.getFoldersByName(firstLevelFolderName);
    var firstLevelFolder = (folders.hasNext()) ? folders.next() : DriveApp.createFolder(firstLevelFolderName);

    /* Find the user-specific folder, create if the folder does not exist */
    var dropbox = getFieldValue('event_title');    /* Name of the Drive folder where the files should be saved */    
    folders = DriveApp.getFoldersByName(dropbox);
    var folder = (folders.hasNext()) ? folders.next() : firstLevelFolder.createFolder(dropbox); 

    
    
    
    /* Get the file uploaded though the form as a blob */
    
    if(getFieldValue('form_id')!=""){
     var file = DriveApp.getFileById(getFieldValue('form_id'));
      folder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);  
    }
    
    
    
    var spreadsheetfile = DriveApp.getFileById(ss.getId());
    
    folder.addFile(spreadsheetfile);
    DriveApp.getRootFolder().removeFile(spreadsheetfile);  
    
    
return true;
  } catch (error) {

    /* If there's an error, show the error message */
   Logger.log( error.toString());
  }

}
