import ApiClient from "../utils/ApiClient";
import { Record } from "pocketbase";

export class Api {
    static async getResidents(householdId) {
        const filter = householdId ? `active = true && household = "${householdId}"` : "active = true";

        const result = await ApiClient.collection("resident_snapshots").getFullList(200, {
            filter,
            expand: "resident, household",
        });

        return result;
    }

    static async getPermanentResidents({ filter }) {
        const records = await ApiClient.collection("resident_snapshots").getFullList(200, {
            filter,
            sort: "-created",
            expand: "resident, household",
        });

        return records.map((record) => {
            const { id, relation_with_householder } = record;
            const { resident, household } = record.expand;
            const { id: residentId, name, birthday, citizen_id } = resident ?? {};
            const { number, address } = household ?? {};
            return new Record({
                id,
                name,
                birthday,
                number,
                address,
                citizen_id,
                relation_with_householder,
                resident: residentId,
            });
        });
    }

    static async getAllResidents() {
        const records = await ApiClient.collection("resident_snapshots").getFullList(200, {
            expand: "resident, household",
            sort: "-created",
            filter: "active = true",
        });
        return records;
    }
    static async getAllResidentsInfo() {
        const records = await ApiClient.collection("residents").getFullList(200, {});
        return records;
    }
    static async getResidentInfo(residentId, autoCancel = true) {
        const result = await ApiClient.collection("residents").getOne(residentId, {
            $autoCancel: autoCancel,
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

    static async getHouseholds({ filter }) {
        const records = await ApiClient.collection("households").getFullList(200, {
            sort: "-created",
            filter,
        });
        return records;
    }

    static async getHouseholdById(householdId) {
        const record = await ApiClient.collection("households").getOne(householdId);
        return record;
    }

    static async createHousehold(householdData) {
        return ApiClient.collection("households").create(householdData);
    }

    static async deleteHousehold(household) {
        await ApiClient.collection("households").delete(household.id);
    }

    //---gift---
    static async getGiftReports() {
        const records = await ApiClient.collection("gift_report").getFullList(200, {
            sort: "-created",
        });
        return records;
    }

    static async getGiftReportById(reportId) {
        const record = await ApiClient.collection("gift_report").getOne(reportId);
        return record;
    }

    static async createGiftReport(reportData) {
        await ApiClient.collection("gift_report").create(reportData);
    }

    static async deleteGiftReport(report) {
        await ApiClient.collection("gift_report").delete(report.id);
    }

    static async getGifts({ filter }) {
        const records = await ApiClient.collection("gift").getFullList(200, {
            sort: "-created",
            filter,
            expand: "resident, household",
        });
        return records.map((record) => {
            const { id, gift_type, expand } = record;
            const { resident, household } = expand;
            const { name } = resident ?? {};
            const { address } = household ?? {};
            return new Record({ id, name, address, gift_type });
        });
    }

    static async createGift(giftData) {
        const snapshot = await ApiClient.collection("resident_snapshots").getFirstListItem(200, {
            filter: `active = true && resident = "${giftData.get("resident")}"`,
        });
        giftData.set("household", snapshot.household);

        await ApiClient.collection("gift").create(giftData);
    }

    static async deleteGift(giftId) {
        const result = await ApiClient.collection("gift").delete(giftId);
        return result;
    }
    static async updateGift(giftId, data) {
        await ApiClient.collection("gift").update(giftId, data);
    }

    //---END

    static async getRewardReports() {
        const records = await ApiClient.collection("reward_report").getFullList(200, {
            sort: "-created",
        });
        return records;
    }

    static async getRewardReportById(id) {
        const record = await ApiClient.collection("reward_report").getOne(id);
        return record;
    }

    static async createRewardReport(rewardReportData) {
        await ApiClient.collection("reward_report").create(rewardReportData);
    }

    static async deleteRewardReport(report) {
        await ApiClient.collection("reward_report").delete(report.id);
    }

    static async getRewards({ filter }) {
        const records = await ApiClient.collection("reward").getFullList(200, {
            filter,
            sort: "-created",
            expand: "resident, household",
        });
        console.log("🚀 ~ records", records);
        return records.map((record) => {
            const { id, collectionId, school, grade, education_result, education_proof, amount, expand } =
                record;
            const { resident, household } = expand;
            const { name } = resident ?? {};
            const { address } = household ?? {};
            return new Record({
                id,
                collectionId, // need collectionId to get url to uploaded image
                name,
                address,
                school,
                grade,
                education_result,
                education_proof,
                amount,
            });
        });
    }

    static async createReward(rewardData) {
        const snapshot = await ApiClient.collection("resident_snapshots").getFirstListItem(200, {
            filter: `active = true && resident = "${rewardData.get("resident")}"`,
        });
        rewardData.set("household", snapshot.household);

        let amount = 10;
        switch (rewardData.get("education_result")) {
            case "Tiên tiến":
                amount = 7;
                break;
            case "Trung bình":
                amount = 5;
                break;
            default:
                break;
        }
        rewardData.set("amount", amount);

        await ApiClient.collection("reward").create(rewardData);
    }

    static async deleteReward(rewardId) {
        const result = await ApiClient.collection("reward").delete(rewardId);
        return result;
    }
    static async updateReward(rewardId, data) {
        await ApiClient.collection("reward").update(rewardId, data);
    }
    static async addReward(data) {
        let result = await ApiClient.collection("reward").create(data);
        return result;
    }

    static async updateResidentSnapshot(id, data) {
        return ApiClient.collection("resident_snapshots").update(id, data);
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

    static async getHouseholdIdByResidentId() {
        const records = await ApiClient.collection("resident_snapshots").getFullList(200, {
            expand: "resident, household",
        });
        const result = {};
        for (const record of records) {
            const { expand } = record;
            const { resident, household } = expand;
            result[resident?.id] = household?.id;
        }
        return result;
    }

    static async getResidentChanges({ filter }) {
        const records = await ApiClient.collection("resident_changes").getFullList(200, {
            filter,
            sort: "-created",
            expand: "resident, old_household, new_household",
        });
        return records.map((record) => {
            const { id, change_type, expand } = record;
            const { resident, old_household, new_household } = expand;
            const { name } = resident;
            const { id: old_household_id, address: old_address } = old_household;
            const { id: new_household_id, address: new_address } = new_household;
            return new Record({
                id,
                name,
                change_type,
                old_household: old_household_id,
                new_household: new_household_id,
                old_address: change_type == "Qua đời" ? undefined : old_address,
                new_address: change_type == "Qua đời" ? undefined : new_address,
            });
        });
    }

    static async getAbsentResidents() {
        const result = await ApiClient.collection("absent_residents").getFullList(200, {
            sort: "-created",
            expand: "resident",
        });
        return result.map((r) => ({
            id: r.id,
            name: r.expand.resident?.name,
            from: r.from,
            to: r.to,
        }));
    }

    static async createAbsentResident(data) {
        await ApiClient.collection("absent_residents").create(data);
    }

    static async getTemporaryResidents() {
        const result = await ApiClient.collection("temporary_residents").getFullList(200, {
            sort: "-created",
            expand: "resident",
        });
        return result.map((r) => ({
            id: r.id,
            name: r.expand.resident?.name,
            from: r.from,
            to: r.to,
            address: r.address,
        }));
    }

    static async createTemporaryResident(data) {
        await ApiClient.collection("temporary_residents").create(data);
    }
}
