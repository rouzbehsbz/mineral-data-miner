import axios from "axios";
import cheerio from "cheerio";

class WebCrawlerService {
  public async getMineralNamesAndURLsList() {
    let result: {
      name: string;
      url: string;
    }[] = [];
    const { data: requestResult } = await axios.get<string>(
      "https://www.usgs.gov/centers/national-minerals-information-center/commodity-statistics-and-information"
    );

    const $ = cheerio.load(requestResult);

    $("div.tex2jax_process ul li").each((_, el) => {
      const url = $(el).find("a").attr("href");
      const name = $(el).find("a").text();

      if (url) {
        result.push({
          name: name,
          url: `https://www.usgs.gov${url}`,
        });
      }
    });

    return result;
  }

  public async getCountryNamesList() {
    let result: string[] = [];
    const { data: requestResult } = await axios.get<string>(
      "https://www.usgs.gov/centers/national-minerals-information-center/international-minerals-statistics-and-information"
    );

    const $ = cheerio.load(requestResult);

    $("div.tex2jax_process ul li").each((_, el) => {
      const url = $(el).find("a").attr("href");
      const name = $(el).find("a").text();

      if (url) {
        result.push(name);
      }
    });

    return result;
  }

  public async getAvailableMineralExcelLinks(mineralUrl: string) {
    let result: {
      year: string;
      url: string | null;
    }[] = [];
    const { data: requestResult } = await axios.get<string>(mineralUrl);

    const $ = cheerio.load(requestResult);

    $("div.tex2jax_process ul li a").each((_, el) => {
      if ($(el).parent().parent().prev().text() === "Minerals Yearbook") {
        if (
          $(el).attr("href")?.endsWith("xlsx") ||
          $(el).attr("href")?.endsWith("xls")
        ) {
          result.push({
            year: $(el).text(),
            url: $(el).attr("href") || null,
          });
        }
      }
    });

    return result;
  }

  public async getExcelFileFromURL(excelUrl: string) {
    const { data: requestResult } = await axios.get<ArrayBuffer>(excelUrl, {
      responseType: "arraybuffer",
    });

    return requestResult;
  }
}

export default WebCrawlerService;
