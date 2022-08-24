import ExcelService from "./services/excelService";

const testExcel = new ExcelService("test2.xlsx");

console.log(
  testExcel.getProductionDataOfSpecificSheetByCountry("T7", "vietnam")
);
