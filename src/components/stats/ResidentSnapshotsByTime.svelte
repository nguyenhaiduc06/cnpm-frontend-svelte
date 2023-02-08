<script>
    import client from "@/utils/ApiClient";
    import { CollectionResidentSnapshots } from "@/utils/database/collections";
    import PageWrapper from "../base/PageWrapper.svelte";
    import Table from "../base/Table.svelte";
    import DateField from "../records/fields/DateField.svelte";

    let isLoading;
    let records = [];
    let startDate;
    let endDate;
    $: filteredRecords = records.filter((r) => {
        if (!startDate || !endDate) {
            return true;
        }
        //TODO: return record that valid between startDate and endDate;
        return true;
    });

    load();

    async function load() {
        isLoading = true;
        records = await client.collection("resident_snapshots").getFullList(200, {
            sort: "-created",
            $autoCancel: false,
        });
        console.log("🚀 ~ records", records);
        isLoading = false;
    }
</script>

<PageWrapper>
    <div class="flex">
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
        <button type="button" class="btn btn-expanded" on:click={load}>
            <span class="txt">Lọc</span>
        </button>
    </div>
    <Table {isLoading} records={filteredRecords} fields={CollectionResidentSnapshots.schema} />
</PageWrapper>
