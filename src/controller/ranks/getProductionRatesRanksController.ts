import { Request } from "express";
import HttpController, { HttpHandlerResult } from "..";
import db from "../../database";

class GetProductionRatesRanksController extends HttpController {
  public async handler(req: Request): Promise<HttpHandlerResult> {
    let { country, mineral } = req.query;

    country = country ? (country as string) : "";
    mineral = mineral ? (mineral as string) : "";

    let ranks: {
      year: number;
      rank: number;
    }[] = [];

    const findYears = await db.production_rates.findMany({
      distinct: "year",
      select: {
        year: true,
      },
    });

    const findProductionRates = await db.production_rates.findMany({
      where: {
        mineral: mineral,
      },
      select: {
        country: true,
        year: true,
        amount: true,
      },
    });

    for (const yearInfo of findYears) {
      const filterdProductionRatesByYear = findProductionRates.filter(
        (productionRate) => productionRate.year === yearInfo.year
      );
      const sortedProductionratesByAmount = filterdProductionRatesByYear.sort(
        (a, b) => +b.amount - +a.amount
      );

      const findCountryRank =
        sortedProductionratesByAmount.findIndex(
          (productionRate) => productionRate.country === country
        ) + 1;

      if (findCountryRank > 0) {
        ranks.push({
          year: yearInfo.year,
          rank: findCountryRank,
        });
      }
    }

    return {
      container: ranks,
    };
  }
}

export default GetProductionRatesRanksController;
