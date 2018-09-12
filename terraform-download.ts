import * as t1 from "vsts-task-lib/task";
import * as path from "path";
import * as util from "util"

import { DownloadUtility } from './operations/DownloadUtility';

async function run() {
	try {
		tl.setResourcePath(path.join(__dirname, "task.json"));

		let downloadDirectory: string = tl.getInput("TerraformDirectory", true);
		let TerraformVersion: string = tl.getInput("TerraformVersion", true);

		let downloadLink = util.format("https://releases.hashicorp.com/terraform/%s/terraform_%s_windows_386.zip")


		await DownloadUtility.DownloadFile(downloadDirectory, downloadLink)
		.then(function(zipFilePath) {
				return DownloadUtility.ExtractZip(downloadDirectory, zipFilePath);
		});
	}
	catch (error) {
		tl.setResult(tl.TaskResult.Failed, error);
	}
}
