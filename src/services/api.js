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

    static async createResidentSnapshot(data) {
        return ApiClient.collection("resident_snapshots").create(data);
    }

    static async getHouseholds() {
        const records = await ApiClient.collection("households").getFullList(200, {});

        return records.map((record) => ({
            id: record.id,
            number: record.number,
            address: record.address,
        }));
    }

    static async createHousehold(householdData) {
        const record = await ApiClient.collection("households").create(householdData);
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
}
