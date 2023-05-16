import {
    useError,
    useMaybeBody,
    useMaybeResult,
    useMetrics,
    useProduct, useProductMetrics,
    useQuery,
    useSortedProducts,
    useSubmitted
} from "../data";
import {calculationSources} from "../../../calculations";
import {ReportData, Report} from "../../../client";
import {FastifyRequest} from "fastify";
import {addReportFromRequest} from "../../../listen/report/add-report";
import {background} from "../../../background";
import {ProductListItem} from "../../client/components/product/list-item";
import {getReportMetrics, ReportMetrics} from "../../../data";

export async function submit(request: FastifyRequest) {
    // 👀
    const report = await addReportFromRequest(request);

    // For now try to trigger the background job for the
    // report processing.
    //
    // ... it will block the submission until then
    //
    // Later we will do this only on a schedule
    await background();

    return {
        report,
        metrics: await getReportMetrics(report.reportId)
    };
}

export function Calculator() {
    const products = useSortedProducts();
    const body = useMaybeBody<ReportData>();
    const submitted = useSubmitted();
    const result = useMaybeResult<{ report: Report, metrics: ReportMetrics }>();
    const error = useError();
    const { productName } = useQuery();
    const submittedProduct = useProduct(body?.productId);
    const metrics = useProductMetrics("month");
    return (
        <form name="calculator" action="/calculator" method="post">
            {error ? (
                <>
                    <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-red-400 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
                        <p className="text-sm leading-6 text-white">
                            {error instanceof Error ? error.message : String(error)}
                        </p>
                    </div>
                    <br/>
                    <br/>
                </>
            ) : undefined}
            {
              submitted && result ? (

                  <p>
                      Your calculation is being processed, please see <a href="/metrics" className="text-blue-600 hover:bg-white underline hover:underline-offset-2">Metrics</a><br/>
                      <br/>
                      {
                          submittedProduct ? (
                              <ul className="list-none">
                                  <ProductListItem report={!!result.metrics} product={submittedProduct} metrics={result.metrics ? ({
                                      metrics: [result.metrics],
                                      products: result.metrics.products
                                  }) : metrics[submittedProduct.productId]} />
                              </ul>
                          ) : (
                              <>
                                  Provided Name: {result.report.productText}<br/>
                                  Product not found in database<br/>
                                  Metrics stored, but not applied to daily metrics
                              </>
                          )
                      }
                      {(result.report.productId && !submittedProduct?.activeIngredients) ? "No active ingredients listed for product" : ""}
                      <br/>
                      <br/>
                      <hr />
                      <br/>
                      <br/>
                  </p>
              ) : undefined
            }
            {
                result ? (
                    <script type="application/json" id="result" dangerouslySetInnerHTML={{__html: JSON.stringify(result, undefined, "  ")}} />
                ) : undefined
            }
            <script type="application/json" id="products" dangerouslySetInnerHTML={{__html: JSON.stringify(products)}} />

            <input type="hidden" name="countryCode" value={body?.countryCode ?? "NZ"} />
            <input type="hidden" name="timezone" value={body?.timezone ?? "Pacific/Auckland"} />

            <div>
                <label htmlFor="productPurchase">Product Purchase Calculation?</label>
                <input type="checkbox" name="productPurchase_boolean" defaultChecked={body?.productPurchase ?? true} className="form-checkbox rounded mx-4" />
            </div>
            <br />
            <br />

            <div>
                <input className="form-input rounded-md disabled:bg-slate-300 disabled:cursor-not-allowed" type="text" name="productText" placeholder="Product Name" disabled={!!productName} defaultValue={productName ?? (error ? body?.productText : undefined)} />
                {
                    productName ? <input type="hidden" name="productName" value={productName} /> : undefined
                }
                <input className="form-input rounded-md" type="number" name="productPurchaseItemCost" step="0.01" placeholder="Item Cost" defaultValue={error ? body?.productPurchaseItemCost : undefined} />
                <input className="form-input rounded-md" type="number" name="productPurchaseItems" step="1" placeholder="Item Count" defaultValue={body?.productPurchaseItems} />
                <input className="form-input rounded-md" type="number" name="productPurchaseDeliveryCost" step="0.01" placeholder="Delivery Cost" defaultValue={body?.productPurchaseDeliveryCost} />
                <input className="form-input rounded-md" type="number" name="productPurchaseFeeCost" step="0.01" placeholder="Purchase Fees" defaultValue={body?.productPurchaseFeeCost} />
                <input className="form-input rounded-md" type="text" name="productPurchaseOrganisationText" placeholder="Purchased From" defaultValue={body?.productPurchaseOrganisationText} />
            </div>
            <br />
            <br />
            <div>
                <label htmlFor="anonymous">Anonymous</label>
                <input type="checkbox" name="anonymous_boolean" className="form-checkbox rounded mx-4" defaultChecked={body?.anonymous ?? false} />
            </div>
            <br />
            <br />
            <p>
                I give consent for the above information to be stored and used with the following calculations,
                and be used for any purpose that the calculation results are intended for, including
                but not limited to public publishing of the information.
            </p>
            <ul className="list-none">
                {
                    calculationSources.map(({ calculationKey, title, description }, index) => {
                        const consented = !!body?.calculationConsent?.find(
                            value => value.calculationKey === calculationKey
                        )?.consented;
                        return (
                            <li key={calculationKey} className="my-4">
                                <input name={`calculationConsent[${index}].calculationKey`} type="hidden" value={calculationKey} />
                                <div>
                                    <label htmlFor={`calculationConsent[${index}].consented_boolean`}>{title}</label>
                                    <input name={`calculationConsent[${index}].consented_boolean`} type="checkbox" className="form-checkbox rounded mx-4" defaultChecked={consented} />
                                </div>
                                <div>
                                    {description}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <br />
            <button type="submit" className="bg-sky-500 hover:bg-sky-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white">
                Submit & Calculate
            </button>
        </form>
    )
}