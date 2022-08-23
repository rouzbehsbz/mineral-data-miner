import ExcelService from "./services/excelService";

const testExcel = new ExcelService("test.xlsx");

console.log(testExcel.getSheetData("T8"));
