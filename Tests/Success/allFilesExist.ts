import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import { resolve } from 'q';

let taskPath = path.join(__dirname, '..', '..', "buildAndReleaseTask" , 'index.js');
let mockRunner: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

mockRunner.setInput("TerraformVersion", "value");
mockRunner.setInput("TerraformDirectory", "value 2");

class DownloadUtility {
    constructor() {}

    DownloadFile(downloadLink: string, directory: string) {
        console.log("mock download called.");        
        return new Promise((resolve, reject) => { resolve(""); });
    }

    ExtractZip(targetDirectory: string, filePath: string) {     
        console.log("mock extract called.");   
    }

    DoesFileExist(directory: string, fileName: string) {
        return new Promise((resolve, reject) => { resolve(true); });
    }
}

mockRunner.registerMock("./operations/DownloadUtility", {
    DownloadUtility: DownloadUtility     
})

mockRunner.run();