/*export interface CustomerResponse {
    status: number;
    data: any;
}

export interface CustomerResponseAWS {
    statusCode: Number;
    body: any;
    headers: any;
}*/


export interface ScanTransactionResponse {
    lastEvaluatedKey: any;
    results: any[];
    segment: number;
    currentRowsNumber: number;
}