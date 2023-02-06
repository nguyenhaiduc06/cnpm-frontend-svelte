import ApiClient from "../utils/ApiClient";

export class Api {
    static async getResidents(householdId) {
        const filter = householdId ? `active = true && household = "${householdId}"` : "active = true";

        const result = await ApiClient.collection("resident_snapshots").getFullList(200, {
            filter,
            expand: "resident, household",
        });

        return result;
    }
    static async getAllResidents() {
        const records = await ApiClient.collection("resident_snapshots").getFullList(200, {
            expand: "resident, household",
            sort: "-created",
            filter: "active = true"
        });
        return records;
    }
    static async getAllResidentsInfo() {
        const records = await ApiClient.collection("residents").getFullList(200, {});
        return records;
    }
    static async getResidentInfo(residentId, autoCancel = true){
        const result = await ApiClient.collection("residents").getOne(residentId, {
            $autoCancel: autoCancel
        });
        return result;
    }

    static async createResident(data) {
        return ApiClient.collection("residents").create(data);
    }

    static async getResidentSnapshot(residentSnapshotId) {
        return ApiClient.collection("resident_snapshots").getOne(residentSnapshotId);
    }
    static async createResidentSnapshot(data) {
        return ApiClient.collection("resident_snapshots").create(data);
    }

    static async getHouseholds({filter}) {
        const records = await ApiClient.collection("households").getFullList(200, {filter: filter || ""});

        return records.map((record) => ({
            id: record.id,
            number: record.number,
            address: record.address,
        }));
    }

    static async createHousehold(householdData) {
        return ApiClient.collection("households").create(householdData);
    }

    static async deleteHousehold(household) {
        await ApiClient.collection("households").delete(household.id);
    }
    
    static async getGiftReports() {
        const records = await ApiClient.collection("gift_report").getFullList(200, {});
        return records;
    }
    static async deleteGiftReport(report) {
        await ApiClient.collection("gift_report").delete(report.id);
    }
    static async getGifts(reportId) {
        const records = await ApiClient.collection("gift").getFullList(200, {
            filter: `gift_report="${reportId}"`,
        });
        return records;
    }
    static async deleteGift(giftId) {
        const result = await ApiClient.collection("gift").delete(giftId);
        return result;
    }
    static async updateGift(giftId, data){
        await ApiClient.collection("gift").update(giftId, data);
    }
    
    
    static async getRewardReports() {
        const records = await ApiClient.collection("reward_report").getFullList(200, {});
        return records;
    }
    static async deleteRewardReport(report) {
        await ApiClient.collection("reward_report").delete(report.id);
    }
    static async getRewards(reportId) {
        const records = await ApiClient.collection("reward").getFullList(200, {
            filter: `reward_report="${reportId}"`,
        });
        return records;
    }
    static async deleteReward(rewardId) {
        const result = await ApiClient.collection("reward").delete(rewardId);
        return result;
    }
    static async updateReward(rewardId, data){
        await ApiClient.collection("reward").update(rewardId, data);
    }
    static async addReward(data){
        let result = await ApiClient.collection("reward").create(data);
        return result;
    }
    
    static async updateResidentSnapshot(id, data) {
        return ApiClient.collection("resident_snapshots").update(id, data)
    }

    static async createResidentChange(data) {
        return ApiClient.collection("resident_changes").create(data);
    }

    static async getResidentChange() {
        const filter = `change_type != "dead"`;
        const result = await ApiClient.collection("resident_changes").getFullList(200, {
            filter,
            expand: "resident,old_household,new_household",
        });
        
        return result;
    }
}
