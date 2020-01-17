/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import PapaParse, { ParseResult } from "papaparse";

export class CSVParser {
  public static parseCSVFromBase64(base64: string, flatten?: boolean): Array<string> | ParseResult {
    const buffer: Buffer = Buffer.from(base64, "base64");
    const char: string = buffer.toString("ascii");
    const parseResult = this.parse(char);

    if (flatten) {
      return this.flatten(parseResult);
    }
    return parseResult;
  }

  private static parse(text: string): ParseResult {
    return PapaParse.parse(text);
  }

  private static flatten(result: ParseResult): Array<string> {
    const { data } = result;
    const flattenData: Array<string> = [];
    data.map((entry) => {
      entry.map((indexes: string) => {
        if (indexes.length >= 1) {
          flattenData.push(indexes);
        }
      });
    });
    return flattenData;
  }
}
