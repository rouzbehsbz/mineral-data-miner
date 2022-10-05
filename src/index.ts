import ExcelService from "./services/excelService";
import WebCrawlerService from "./services/webCrawlerService";

import HttpServer from "./httpServer";

// WebCrawlerService.getExcelFileFromURL(
//   "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/mineral-pubs/chromium/myb1-2015-chrom.xlsx"
// ).then((res) => {
//   const testExcel = new ExcelService(Buffer.from(res));

//   const sheets = testExcel.getWorldProductionSpecifiedSheetNames();

//   console.log(sheets);

//   console.log(
//     testExcel.getProductionDataOfSpecificSheetByCountry(sheets[1], "Iran")
//   );
// });

new HttpServer();
