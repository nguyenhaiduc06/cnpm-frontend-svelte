<script>
    import client from "@/utils/ApiClient";
    import { Record } from "pocketbase";
    import PageWrapper from "../base/PageWrapper.svelte";
    import Table from "../base/Table.svelte";
    import DateField from "../records/fields/DateField.svelte";

    let isLoading;
    let records = [];
    let startDate;
    let endDate;
    $: filteredRecords = records.filter((r) => {
        if (!startDate || !endDate) {
            return r.active == true;
        }
        return before(startDate, r.created) && before(r.updated, endDate);
    });

    load();

    async function load() {
        isLoading = true;
        const snapshots = await client.collection("resident_snapshots").getFullList(200, {
            sort: "-created",
            expand: "resident, household",
            $autoCancel: false,
        });
        records = snapshots.map((record) => {
            const { id, created, updated, active, expand } = record;
            const { resident, household } = expand;
            const { name } = resident ?? {};
            const { address } = household ?? {};
            return new Record({ id, name, address, created, updated, active });
        });
        isLoading = false;
    }

    function before(t1, t2) {
        const d1 = new Date(t1).getTime();
        const d2 = new Date(t2).getTime();
        return d1 <= d2;
    }
</script>

<PageWrapper>
    <div class="flex m-b-sm">
        <DateField
            field={{
                id: "end_date",
                name: "start_date",
                type: "date",
                system: false,
                required: false,
                unique: false,
                options: {
                    min: "",
                    max: "",
                },
            }}
            bind:value={startDate}
        />
        <DateField
            field={{
                id: "end_date",
                name: "end_date",
                type: "date",
                system: false,
                required: false,
                unique: false,
                options: {
                    min: "",
                    max: "",
                },
            }}
            bind:value={endDate}
        />
    </div>
    <Table
        {isLoading}
        records={filteredRecords}
        fields={[
            { name: "name", label: "Họ và tên" },
            {
                name: "address",
                label: "Địa chỉ",
            },
        ]}
    />
</PageWrapper>
