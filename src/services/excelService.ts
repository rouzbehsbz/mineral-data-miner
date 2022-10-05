import xlsx from "xlsx";
import path from "path";

class ExcelService {
  private workbook: xlsx.WorkBook;
  private sheetNames: string[];

  constructor(file: Buffer) {
    this.workbook = xlsx.read(file);
    this.sheetNames = this.workbook.SheetNames;
  }

  public getSheetData(sheetName: string) {
    if (!this.sheetNames.includes(sheetName)) {
      throw new Error("You are trying to open an invalid sheet.");
    }

    return this.workbook.Sheets[sheetName];
  }

  public getWorldProductionSpecifiedSheetNames(): string[] {
    let foundSheetNames: string[] = [];

    for (const sheetName of this.sheetNames) {
      const worksheet = this.getSheetData(sheetName);

      if (!worksheet["A2"]) {
        continue;
      }
      if (!worksheet["A2"]["t"] || worksheet["A2"]["t"] !== "s") {
        continue;
      }

      const cellValue = worksheet["A2"]["v"] as string;

      if (cellValue.toUpperCase().includes(": WORLD")) {
        foundSheetNames.push(sheetName);
      }
    }

    return foundSheetNames;
  }

  public getProductionDataOfSpecificSheetByCountry(
    sheetName: string,
    countryName: string
  ) {
    let info: {
      year: number;
      country: number;
      world: number;
    }[] = [];

    let years: { year: number; cellChar: string }[] = [];
    let cellsWithTotalAmount: string[] = [];

    const worksheet = this.getSheetData(sheetName);
    const title = worksheet["A2"]["v"] as string;
    const production = title.split(":")[0];

    const keys = Object.keys(worksheet);

    let cellRowNumberForYearsExtracting = "0";
    let countryNeedTotalAmountCellDigit = "-1";
    let countryNeedTotalAmountProcessed = false;

    for (const key of keys) {
      if (!worksheet[key]["t"] || worksheet[key]["t"] !== "s") {
        continue;
      }

      const cellValue = worksheet[key]["v"] as string;

      if (
        cellValue.includes("Country or locality") ||
        cellValue.includes("Country")
      ) {
        cellRowNumberForYearsExtracting =
          this.getCellSepratedCharAndDigit(key).numbs;
        break;
      }
    }

    for (const key of keys) {
      const keySepratedCharAndDigit = this.getCellSepratedCharAndDigit(key);

      if (keySepratedCharAndDigit.numbs !== cellRowNumberForYearsExtracting) {
        continue;
      }
      if (
        !worksheet[key]["t"] ||
        isNaN(`${worksheet[key]["v"]}`.replace("e", "") as any)
      ) {
        continue;
      }

      years.push({
        year: +`${worksheet[key]["v"]}`.replace("e", ""),
        cellChar: keySepratedCharAndDigit.chars,
      });
    }

    for (const key of keys) {
      const keySepratedCharAndDigit = this.getCellSepratedCharAndDigit(key);

      if (keySepratedCharAndDigit.chars !== "A") {
        continue;
      }
      if (!worksheet[key]["t"] || worksheet[key]["t"] !== "s") {
        continue;
      }

      const cellValue = worksheet[key]["v"] as string;

      if (!cellValue.toUpperCase().includes(countryName.toUpperCase())) {
        if (cellValue.toUpperCase() === "TOTAL") {
          cellsWithTotalAmount.push(keySepratedCharAndDigit.numbs);
        }
        continue;
      }

      for (const year of years) {
        if (!worksheet[`${year.cellChar}${keySepratedCharAndDigit.numbs}`]) {
          countryNeedTotalAmountCellDigit = keySepratedCharAndDigit.numbs;
          break;
        }

        const country =
          worksheet[`${year.cellChar}${keySepratedCharAndDigit.numbs}`]["v"];

        info.push({
          year: year.year,
          country:
            country === "NA" || country === "--" ? 0 : (country as number),
          world: 0,
        });
      }
    }

    for (const cellWithTotalAmount of cellsWithTotalAmount) {
      const findIndex = cellsWithTotalAmount.findIndex(
        (cell) => cell === cellWithTotalAmount
      );

      if (
        countryNeedTotalAmountCellDigit !== "-1" &&
        !countryNeedTotalAmountProcessed &&
        +cellWithTotalAmount > +countryNeedTotalAmountCellDigit
      ) {
        for (const year of years) {
          if (!worksheet[`${year.cellChar}${cellWithTotalAmount}`]) {
            countryNeedTotalAmountCellDigit = cellWithTotalAmount;
            break;
          }

          const country =
            worksheet[`${year.cellChar}${cellWithTotalAmount}`]["v"];

          info.push({
            year: year.year,
            country:
              country === "NA" || country === "--" ? 0 : (country as number),
            world: 0,
          });
        }

        countryNeedTotalAmountProcessed = true;
      } else if (findIndex === cellsWithTotalAmount.length - 1) {
        info = info.map((detail) => {
          if (!years.find((year) => year.year === detail.year)) {
            return {
              ...detail,
            };
          }

          const world =
            worksheet[
              `${
                years.find((year) => year.year === detail.year)?.cellChar
              }${cellWithTotalAmount}`
            ]["v"];

          return {
            ...detail,
            world: world === "NA" || world === "--" ? 0 : (world as number),
          };
        });
      }
    }

    return {
      production,
      info,
    };
  }

  private getCellSepratedCharAndDigit(cellName: string) {
    const chars = cellName.slice(0, cellName.search(/\d/));
    const numbs = cellName.replace(chars, "");

    return {
      chars,
      numbs,
    };
  }
}

export default ExcelService;
