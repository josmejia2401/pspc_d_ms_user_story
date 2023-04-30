import { OptionsHttp } from "../../transversal/http";
import { ItemManage } from "../../infrastructure/driven/dyn-item-manage/manage";
import { ItemManageImpl } from "../../infrastructure/driven/dyn-item-manage/manage-impl";
import { Utils } from "../../transversal/utilities/utils";

export class GetItemAllUseCase {
    private logger: any;
    private itemManage: ItemManage;

    constructor(logger: any) {
        this.logger = logger;
        this.itemManage = new ItemManageImpl(logger);
    }

    async execute(projectId: string, filter: {
        lastEvaluatedKey?: string;
        segment?: number;
        limit?: number;
    }, options: OptionsHttp) {
        try {
            if (Utils.isEmpty(projectId)) {
                return await this.itemManage.getByUserId(options.decodedToken!.sub!, filter);
            } else {
                return await this.itemManage.getByUserIdAndProjectId(options.decodedToken!.sub!, projectId, filter);
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}