import {
  chromium,
  type Response as PlaywrightResponse,
  type Request as PlaywrightRequest,
} from 'playwright';

import {  } from "module";

type URL = string;

/**
 * Here, the endpoints argument is the matcher of the request / response.
 * If need more flexibility in future, it will be better to use function instead. And offer the matcher utilities like method matcher, url matcher.
 * Further more, the response / request recorder can be gave more flexibility to inject the on event listener from outside.

 * TODO: maybe create a interceptor creator for reuse?
 */
const intercept = async <TEndpoint extends string>(
  url: string,
  endpoints: TEndpoint[]
) => {
  type EndpointsRecord = Record<
    TEndpoint,
    {
      response: PlaywrightResponse | undefined;
      request: PlaywrightRequest | undefined;
    }
  >;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const responsePromise = new Promise<Partial<EndpointsRecord>>((resolve) => {
    const endpointsRecord = endpoints.reduce((record, endpoint) => {
      record[endpoint] = {
        response: undefined,
        request: undefined,
      };
      return record;
    }, {} as EndpointsRecord);

    page.on('request', async (req) => {
      const url = req.url() as TEndpoint;
      if (endpoints.includes(url)) {

        endpointsRecord[url].request = req;
      }
    });

    page.on('response', async (res) => {
      const url = res.url() as TEndpoint;
      if (endpoints.includes(url)) {
        endpointsRecord[url].response = res;
      }
    });

    page.on('close', () => {
      resolve(endpointsRecord);
    });
  });

  await page.goto(url);

  await browser.close();
  return await responsePromise;
};

export { intercept };
