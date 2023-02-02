import ApiClient from "../utils/ApiClient";

export async function getResidents(householdId) {
    const filter = householdId ? `active = true && household = "${householdId}"` : "active = true";

    const result = await ApiClient.collection("resident_snapshots").getFullList(200, {
        filter,
        expand: "resident",
    });

    return result;
}

export async function getHouseholds() {
    const result = await ApiClient.collection("households").getFullList(200, {});

    return result;
}
