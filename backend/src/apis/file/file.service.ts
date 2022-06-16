import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';

interface IFile {
  files: FileUpload[];
  type: string;
}

@Injectable()
export class FileService {
  async upload({ files, type }: IFile) {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    const waitedFiles = await Promise.all(files);

    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          const fname = `${type}/${uuidv4()}/${el.filename}`;

          el.createReadStream()
            .pipe(
              storage.file(fname).createWriteStream({ resumable: false }), // { resumable: false } 추가해야 오류발생X
            )
            .on('finish', () =>
              resolve(
                `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${fname}`,
              ),
            )
            .on('error', (err) => reject(err));
        });
      }),
    );
    console.log(results);
    return results;
  }
}
