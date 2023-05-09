import {getKeyValueStore} from "../kv";
import {Report} from "./types";
import {ReportReference} from "./reference";

const STORE_NAME = "report" as const;
const QUEUE_STORE_NAME = "reportQueue" as const;

export function getReportStore() {
    return getKeyValueStore<Report>(STORE_NAME);
}

export function getReportQueueStore() {
    return getKeyValueStore<ReportReference>(QUEUE_STORE_NAME);
}
