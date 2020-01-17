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




// tslint:disable-next-line:no-var-requires
const IP = require("ip-subnet-calculator");
import { PkParse } from "@symlinkde/eco-os-pk-models";

export class IPParser {
  public static calculateSubnetMask(address: string): PkParse.ICalculatedSubnetMask | null {
    if (address.indexOf("/") > -1 && this.isValidIpAddress(address)) {
      const subnetPrefix: number = Number(address.substring(address.indexOf("/") + 1, address.length));
      const ipAdr: string = address.substring(0, address.indexOf("/"));
      return IP.calculateSubnetMask(ipAdr, subnetPrefix);
    }

    return null;
  }

  public static isValidIpAddress(address: string): boolean {
    if (address.indexOf("/") > -1) {
      const ipAdr: string = address.substring(0, address.indexOf("/"));
      return IP.isIp(ipAdr);
    }

    return IP.isIp(address);
  }

  public static extractIpV4Address(address: string | string[]): string | string[] | null {
    if (address === undefined || address === null || this.isIpLocalhost(address)) {
      return null;
    }

    return this.extractIp(address);
  }

  public static isIpLocalhost(address: string | string[]): boolean {
    if (address === "::1" || address === "127.0.0.1") {
      return true;
    }

    return false;
  }

  private static extractIp(address: string | string[]): string | string[] {
    if (address.includes(",") && !Array.isArray(address)) {
      return address.split(",").map((entry: string) => entry.replace(/\s/g, "").trim());
    }

    if (Array.isArray(address) && address.length > 0) {
      if (address.includes("::ffff:")) {
        address = address[0].split(":").reverse()[0];
      }
      return address[0].replace(/:\d+$/, "");
    }

    if (!Array.isArray(address)) {
      if (address.includes("::ffff:")) {
        return address
          .replace(/:\d+$/, "")
          .split(":")
          .reverse()[0];
      }
      return address.replace(/:\d+$/, "");
    }

    return "";
  }
}
