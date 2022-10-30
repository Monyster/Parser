import cherio from 'cherio'
import chalk from 'chalk'
import { getPageContent } from './GetPageContent.js';

import fs from 'fs';
var data = {
    table: []
}

async function main() {
    try {
        for (let page = 0; page < 10; page++) {
            const url =
                `https://auto.ria.com/uk/search/?indexName=auto,order_auto,newauto_search&categories.main.id=2&country.import.usa.not=-1&price.currency=1&abroad.not=-1&custom.not=-1&page=${page}&size=5`
            const pageContent = await getPageContent(url);

            const $ = cherio.load(pageContent)
            $(".content-bar").each((i, content) => {
                const title = $(content).find($(".content")).find($(".head-ticket")).find($(".item")).find($("span")).text().trim();
                const priceUSD = $(content).find($(".content")).find($(".price-ticket")).find($("span")).find($(`span[data-currency="USD"]`)).text().replace(/\s+/g, '');
                const addDate = $(content).find($(".content")).find($(".footer_ticket")).find($("span")).data("add-date");

                const object = {
                    title,
                    priceUSD,
                    addDate
                }

                data.table.push(object)
            })
        }

        fs.writeFile("auto-ria-parsed-data.json", JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log(chalk.green('Sucessfully completed!'));
        }
        );
    } catch (error) {
        console.log(chalk.red(`An error - ${error}`))
    }
}


main();


