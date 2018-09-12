import * as path from 'path';
import * as fs from 'fs-promise';
import * as extract from 'extract-zip';
import {
	HttpClient,
	HttpClientResponse
} from "typed-rest-client/HttpClient";


export static class DownloadUtility {

  private _http: HttpClient;

  public constructor() {
    _http = new HttpClient()
  }

  public static async DownloadFile(downloadLink: string, directory: string) : promise<string> {
    let fileName = path.basename(downloadLink);
    let filepath: string = path.join(directory, fileName);

    let file = NodeJS.WritableStream = fs.createWriteStream(filePath);
    (await _http.get(downloadLink)).message.pipe(file);

    return filepath;
  }

  public static ExtractZip(targetDirectory: string, filePath: string) {
    let extensionType = path.extname(filePath);
    if(extensionType !== '.zip') {
      console.log(t1.loc("InvalidFileExtension", '.zip', extensionType));
      return;
    }

    extract(filePath,
      function(err) {
        if(err) {
          console.log(t1.loc("ExtractionFailed", filePath, err))
        }
      });
  }

  public static async DoesFileExist(directory: string, fileName: string) : promise<boolean> {

    let fileExists = false;

    fs.walk(directory).then(
      listing => listing.foreEach(file => {
        if(file == fileName) {
          fileExists = true;
        }
      })
    ).catch( err => console.log(err));

    return fileExists;
  }

}
