import xlsx from "xlsx";
import path from "path";

class ExcelService {
  private workbook: xlsx.WorkBook;
  private sheetNames: string[];

  constructor(filePath: string) {
    this.workbook = xlsx.readFile(path.resolve("public", filePath));
    this.sheetNames = this.workbook.SheetNames;
  }

  public getSheetData(sheetName: string) {
    if (!this.sheetNames.includes(sheetName)) {
      throw new Error("You are trying to open an invalid sheet.");
    }

    return this.workbook.Sheets[sheetName];
  }
}

export default ExcelService;
