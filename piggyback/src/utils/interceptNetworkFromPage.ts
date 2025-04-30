import {
  chromium,
  type Response as PlaywrightResponse,
  type Request as PlaywrightRequest,
} from 'playwright';

/**
 * Here, the endpoints argument is the matcher of the request / response.
 * If need more flexibility in future, it will be better to use function instead. And offer the matcher utilities like method matcher, url matcher.
 * Further more, the response / request recorder can be gave more flexibility to inject the on event listener from outside.n
 */
const intercept = async <TEndpoint extends string>(
  url: string,
  endpoints: TEndpoint[]
) => {
  type EndpointsRecord = Record<
    TEndpoint,
    [PlaywrightRequest | undefined, PlaywrightResponse | undefined]
  >;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const responsePromise = new Promise<Partial<EndpointsRecord>>((resolve) => {
    const endpointsRecord = endpoints.reduce((record, endpoint) => {
      record[endpoint] = [undefined, undefined];
      return record;
    }, {} as EndpointsRecord);

    page.on('request', async (req) => {
      const url = req.url() as TEndpoint;
      if (endpoints.includes(url)) {
        endpointsRecord[url][0] = req;
      }
    });

    page.on('response', async (res) => {
      const url = res.url() as TEndpoint;
      if (endpoints.includes(url)) {
        endpointsRecord[url][1] = res;
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
