import axios from "axios";

const url = "http://164.90.213.118:8080/api/v1";

async function main() {
  try {
    const findCountries = await axios.get(`${url}/countries`);
    const findMinerals = await axios.get(`${url}/minerals`);

    for (const country of findCountries.data.result) {
      for (const mineral of findMinerals.data.result) {
        try {
          await axios.get(
            `${url}/processes/production-rates?country=${country}&mineral=${mineral}`
          );

          console.log(
            `Getting data of ${country} for ${mineral} has been finished.`
          );
        } catch (err) {
          continue;
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
