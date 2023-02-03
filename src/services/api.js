import ApiClient from "../utils/ApiClient";

export class Api {
    static async getResidents(householdId) {
        const filter = householdId ? `active = true && household = "${householdId}"` : "active = true";

        const result = await ApiClient.collection("resident_snapshots").getFullList(200, {
            filter,
            expand: "resident",
        });

        return result;
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
}