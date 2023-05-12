import {getReportMetricsStore} from "./store";
import {MetricsData, ReportMetrics, ReportMetricsData} from "./types";
import {v4} from "uuid";
import {getReportDates} from "../../calculations";
import {addReportReference} from "../report";

export const NO_REPORT_PREFIX = "withoutReport_" as const;

export function isNoReportMetricsId(reportId: string): reportId is `${typeof NO_REPORT_PREFIX}${string}` {
    return reportId.startsWith(NO_REPORT_PREFIX)
}

export async function addReportMetrics(data: ReportMetricsData) {
    const store = getReportMetricsStore();
    const metricsId = v4();
    const metricsKey = `${NO_REPORT_PREFIX}${metricsId}`;

    const { calculationConsent } = data;
    if (!calculationConsent?.length) {
        throw new Error("No consent given to store report metrics");
    }

    const createdAt = new Date().toISOString();
    const metrics: ReportMetrics = {
        ...data,
        metricsId,
        reportedAt: data.reportedAt ?? createdAt,
        updatedAt: createdAt,
        createdAt,
        reportId: metricsKey,
        calculationConsent
    };
    await store.set(metricsKey, metrics);

    console.log("addReportMetrics", metricsKey, metrics, store.name);

    await addReportReference({
        ...getReportDates(metrics),
        // yeah its getting weird...
        reportId: metricsKey,
        countryCode: data.countryCode
    });

    return metrics;
}