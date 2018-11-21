import * as tasks from "vsts-task-lib/task";
import * as path from "path";
import * as util from "util"

import { DownloadUtility } from './operations/DownloadUtility';

async function run() {
	try {
		tasks.setResourcePath(path.join(__dirname, "task.json"));

		let downloadDirectory: string = tasks.getInput("TerraformDirectory", true);
		let terraformVersion: string = tasks.getInput("TerraformVersion", true);

		console.log(terraformVersion);

		let downloadLink = util.format("https://releases.hashicorp.com/terraform/%s/terraform_%s_windows_386.zip", terraformVersion, terraformVersion);
		let zipName = util.format("terraform_%s_windows_386.zip", terraformVersion);
		let exeName = util.format("terraform.exe");

		console.log(downloadLink);
		console.log(downloadDirectory);

		let utility = new DownloadUtility();

		let zipExists = await utility.DoesFileExist(downloadDirectory, zipName);		

		if(!zipExists) {
			let zipPath = await utility.DownloadFile(downloadLink, downloadDirectory);			
			console.log("donwloaded " + zipPath);
		}

		let exeExists = await utility.DoesFileExist(downloadDirectory, exeName);		

		if(!exeExists) {
			utility.ExtractZip(downloadDirectory, zipName);			
		};
	}
	catch (error) {
		tasks.setResult(tasks.TaskResult.Failed, error);
	}
}

run();