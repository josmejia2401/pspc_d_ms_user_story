import { DynamoDBClient, PutItemCommand, QueryCommand, DeleteItemCommand, UpdateItemCommand, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
// import * as AWS from "@aws-sdk/client-dynamodb";
import { ItemDTO } from "../../../domain/models/item";
import { Constants } from "../../../transversal/constants";
import { DynamoDbUtil } from "../../../transversal/utilities/dynamodb-util";
import { ItemManage } from "./manage";
import { ScanTransactionResponse } from "../../../domain/models/common";
import { Utils } from "../../../transversal/utilities/utils";

export class ItemManageImpl implements ItemManage {

    private readonly connection: DynamoDBClient;
    private logger: any;

    constructor(logger: any) {
        this.logger = logger;
        this.connection = new DynamoDBClient({ region: Constants.REGION });
    }

    async getById(id: string, userId: string): Promise<ItemDTO> {
        try {
            const params = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                KeyConditionExpression: "#id=:id",
                FilterExpression: "#userId=:userId",
                ExpressionAttributeValues: {
                    ":id": {
                        "S": `${id}`
                    },
                    ":userId": {
                        "S": `${userId}`
                    }
                },
                ExpressionAttributeNames: {
                    "#id": "id",
                    "#userId": "userId"
                },
            };
            const result: any = await this.connection.send(new QueryCommand(params));
            return DynamoDbUtil.resultToObject(result.Items[0]);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async getByIdAndStatus(id: string, status: number): Promise<ItemDTO> {
        try {
            const params = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                KeyConditionExpression: "#id=:id",
                FilterExpression: "#status=:status",
                ExpressionAttributeValues: {
                    ":id": {
                        "S": `${id}`
                    },
                    ":status": {
                        "N": `${status}`
                    }
                },
                ExpressionAttributeNames: {
                    "#id": "id",
                    "#status": "status"
                },
            };
            const result: any = await this.connection.send(new QueryCommand(params));
            return DynamoDbUtil.resultToObject(result.Items[0]);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async create(payload: ItemDTO) {
        try {
            const attributes = DynamoDbUtil.buildInsertObject(payload);
            const params = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                Item: attributes,
            } as any;
            return await this.connection.send(new PutItemCommand(params));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async update(id: string, payload: ItemDTO): Promise<any> {
        try {
            const attributes = DynamoDbUtil.buildExpressionAttributes(payload);
            const updateExpression = DynamoDbUtil.buildUpdateExpression(payload);
            const params = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                Key: {
                    "id": { "S": `${id}` }
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: attributes.expressionAttributeValues,
                ExpressionAttributeNames: attributes.expressionAttributeNames,
                ReturnValues: "UPDATED_NEW"
            };
            return await this.connection.send(new UpdateItemCommand(params));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async delete(id: string, userId: string): Promise<any> {
        try {
            const params = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                Key: {
                    "id": { "S": `${id}` }
                },
                ConditionExpression: "#userId=:userId",
                ExpressionAttributeValues: {
                    ":userId": {
                        "S": `${userId}`
                    }
                },
                ExpressionAttributeNames: {
                    "#userId": "userId"
                },
            } as any;
            return await this.connection.send(new DeleteItemCommand(params));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async getByUserId(userId: string, options?: {
        lastEvaluatedKey?: string;
        segment?: number;
        limit?: number;
    }): Promise<ScanTransactionResponse> {
        try {
            const limit = options?.limit || 25;
            const params: ScanCommandInput = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                FilterExpression: "#userId=:userId",
                ExpressionAttributeValues: {
                    ":userId": {
                        "S": `${userId}`
                    }
                },
                ExpressionAttributeNames: {
                    "#userId": "userId",
                },
                Limit: limit,
            };
            let lastEvaluatedKey: any;
            if (!Utils.isEmpty(options?.lastEvaluatedKey)) {
                lastEvaluatedKey = {
                    "id": {
                        "S": options?.lastEvaluatedKey
                    }
                }
            }
            const result = await this.scanBySegment(params, { limit, lastEvaluatedKey, segment: options?.segment });
            if (!Utils.isEmpty(result.lastEvaluatedKey)) {
                result.lastEvaluatedKey = result.lastEvaluatedKey.id.S;
            }
            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async getByUserIdAndProjectId(userId: string, projectId: string, options?: {
        lastEvaluatedKey?: string;
        segment?: number;
        limit?: number;
    }): Promise<ScanTransactionResponse> {
        try {
            const limit = options?.limit || 25;
            const params: ScanCommandInput = {
                TableName: Constants.AWS_DYNAMODB.DYNDB_USERS_STORY_TBL,
                FilterExpression: "#userId=:userId AND #projectId=:projectId",
                ExpressionAttributeValues: {
                    ":userId": {
                        "S": `${userId}`
                    },
                    ":projectId": {
                        "S": `${projectId}`
                    }
                },
                ExpressionAttributeNames: {
                    "#userId": "userId",
                    "#projectId": "projectId"
                },
                Limit: limit,
            };
            let lastEvaluatedKey: any;
            if (!Utils.isEmpty(options?.lastEvaluatedKey)) {
                lastEvaluatedKey = {
                    "id": {
                        "S": options?.lastEvaluatedKey
                    }
                }
            }
            const result = await this.scanBySegment(params, { limit, lastEvaluatedKey, segment: options?.segment });
            if (!Utils.isEmpty(result.lastEvaluatedKey)) {
                result.lastEvaluatedKey = result.lastEvaluatedKey.id.S;
            }
            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    private async scanBySegment(params: ScanCommandInput, options?: { limit?: number; segment?: number; lastEvaluatedKey?: any }): Promise<ScanTransactionResponse> {
        let lastEvaluatedKey: any;
        const results: any[] = [];
        let segment: number = options?.segment || 0;
        if (Constants.AWS_DYNAMODB.DYNDB_SCAN_IS_SEGMENT === true) {
            // Total de hilos
            params.TotalSegments = Constants.AWS_DYNAMODB.DYNDB_SCAN_TOTAL_SEGMET;
            if (Constants.AWS_DYNAMODB.DYNDB_SCAN_IS_PARALLEL === true) {
                params.ExclusiveStartKey = undefined;
                params.Limit = undefined;
                const promises: any[] = [];
                while (segment < Constants.AWS_DYNAMODB.DYNDB_SCAN_NUM_SEGMET) {
                    params.Segment = segment;
                    promises.push(this.connection.send(new ScanCommand(params)));
                    segment++;
                }
                const promisesResult = await Promise.all(promises);
                for (const p of promisesResult) {
                    const items = DynamoDbUtil.resultToObject(p.Items);
                    if (items) {
                        results.push(...items);
                    }
                    if (options?.limit && results.length > options.limit) {
                        break;
                    }
                }
            } else {
                params.ExclusiveStartKey = options?.lastEvaluatedKey;
                while (segment < Constants.AWS_DYNAMODB.DYNDB_SCAN_NUM_SEGMET) {
                    params.Segment = segment;
                    const result = await this.connection.send(new ScanCommand(params));
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    lastEvaluatedKey = result.LastEvaluatedKey;
                    const items = DynamoDbUtil.resultToObject(result.Items);
                    if (items) {
                        results.push(...items);
                    }
                    if (options?.limit && results.length >= options.limit) {
                        break;
                    }
                    segment++;
                }
            }
        } else {
            params.ExclusiveStartKey = options?.lastEvaluatedKey;
            do {
                const result = await this.connection.send(new ScanCommand(params));
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                lastEvaluatedKey = result.LastEvaluatedKey;
                const items = DynamoDbUtil.resultToObject(result.Items);
                if (!Utils.isEmpty(items)) {
                    results.push(...items);
                }
                if (options?.limit && results.length >= options.limit) {
                    break;
                }
            } while (params.ExclusiveStartKey);
        }
        return {
            lastEvaluatedKey,
            results,
            segment,
            currentRowsNumber: results.length,
        }
    }
}
