import path = require('path');
import fs = require('mz/fs');
import unzipper = require('unzipper');
import tasks = require('vsts-task-lib/task');
import klaw = require('klaw');

import {
	HttpClient,
	HttpClientResponse
} from "typed-rest-client/HttpClient";


export class DownloadUtility {

  private httpClient: HttpClient;

  public constructor() {
    this.httpClient  = new HttpClient('task-download/1.0');
  }

  public async DownloadFile(downloadLink: string, directory: string) : Promise<string> {
    
    let fileName = path.win32.basename(downloadLink);

    console.log(fileName);

    let filepath = path.join(directory, fileName);

    console.log(filepath);

    let file = fs.createWriteStream(filepath);

    console.log("stream created");
    let response = await this.httpClient.get(downloadLink);

    console.log("called link");

    response.message.pipe(file);

    console.log("piped content");

    return filepath;
  }

  public ExtractZip(targetDirectory: string, filePath: string) {




    console.log(filePath);

    let extensionType = path.extname(filePath);
    if(extensionType !== '.zip') {
      console.log("Download link has an invalid extension, expected: %s but found: %s.", '.zip', extensionType);
      return;
    }

    console.log("confirmed zip");

    console.log("extracting " + filePath + " from directory " + targetDirectory);

    let fullPath = path.join(targetDirectory, filePath);

    fs.createReadStream(fullPath)
      .pipe(unzipper.Extract({ path: targetDirectory}));

    console.log("extracted");
  }

  public DoesFileExist(directory: string, fileName: string) : Promise<boolean> {    
    let fullPath = path.join(directory, fileName);
    console.log("checking if %s exists", fullPath);

    return new Promise<boolean>((resolve, reject) => {
      let fileExists = false;
      klaw(directory)
      .on('data',
        item => {       
            if(item.path == fullPath) {
              console.log("%s already exists", fileName);
              fileExists = true;
            }        
        })
      .on('error', err => console.log(err))
      .on('end', () => { resolve(fileExists) });
    });
  }
}
