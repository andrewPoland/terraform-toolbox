import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import { resolve } from 'q';

let taskPath = path.join(__dirname, '..', '..', "buildAndReleaseTask" , 'index.js');
let mockRunner: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

mockRunner.setInput("TerraformVersion", "value");

// not setting this should cause failure.
// mockRunner.setInput("TerraformDirectory", "");

class DownloadUtility {
    constructor() {}

    DownloadFile(downloadLink: string, directory: string) {
        return new Promise((resolve, reject) => { resolve(""); });
    }

    ExtractZip(targetDirectory: string, filePath: string) {
    }

    DoesFileExist(directory: string, fileName: string) {
        return new Promise((resolve, reject) => { resolve(true); });
    }
}

mockRunner.registerMock("./operations/DownloadUtility", {
    DownloadUtility: DownloadUtility     
})

mockRunner.run();