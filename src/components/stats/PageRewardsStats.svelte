<script>
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import StatsSidebar from "./StatsSidebar.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";

    let isLoading;
    let records;

    load();

    async function load() {
        isLoading = true;
        const householdIds = (await Api.getHouseholds({ filter: "" })).map((household) => household.id);
        const householdIdByResidentId = await Api.getHouseholdIdByResidentId();

        const amountByHouseholdIds = new Map();

        for (const id of householdIds) {
            if (!amountByHouseholdIds[id]) {
                amountByHouseholdIds[id] = "1";
            }
        }
        let result = [];
        for (const id of Object.keys(amountByHouseholdIds)) {
            result.push({ id: id, household: id, amount: amountByHouseholdIds[id] });
        }

        records = result;

        isLoading = false;
    }
</script>

<StatsSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Thống kê</div>
            <div class="breadcrumb-item">Khen thưởng</div>
        </nav>
    </header>

    <Table
        {isLoading}
        {records}
        fields={[
            {
                name: "household",
                label: "Hộ khẩu",
            },

            {
                name: "amount",
                label: "Số lượng",
            },
        ]}
    />
</PageWrapper>
