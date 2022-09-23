// import ExcelService from "./services/excelService";
// import WebCrawlerService from "./services/webCrawlerService";

import HttpServer from "./httpServer";

// new WebCrawlerService()
//   .getExcelFileFromURL(
//     "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/atoms/files/myb1-2017-gold.xls"
//   )
//   .then((res) => {
//     const testExcel = new ExcelService(Buffer.from(res));

//     const sheets = testExcel.getWorldProductionSpecifiedSheetNames();

//     console.log(
//       testExcel.getProductionDataOfSpecificSheetByCountry(sheets[0], "iran")
//     );
//   });

new HttpServer();
