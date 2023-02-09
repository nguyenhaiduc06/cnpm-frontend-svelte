<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import StatsSidebar from "./StatsSidebar.svelte";
    import Table from "../base/Table.svelte";
    import FormPanel from "../base/FormPanel.svelte";
    import { Api } from "@/services/api";
    import { CollectionResidentSnapshots } from "@/utils/database/collections";
    import { Record } from "pocketbase";

    $: reactiveParams = new URLSearchParams($querystring);
    $: householdId = reactiveParams.get("household-id");
    $: console.log("🚀 ~ householdId", householdId);
    let household;
    $: if (householdId) {
        Api.getHouseholdById(householdId).then((record) => (household = record));
    } else {
        household = undefined;
    }

    let filterByHouseholdFormPanel;

    let isLoading;
    let records;

    $: householdId, load();

    async function load() {
        isLoading = true;
        records = await Api.getResidentChanges({
            filter: `old_household ~ "${householdId ?? ""}" || new_household ~ "${household ?? ""}"`,
        });
        isLoading = false;
    }
</script>

<StatsSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Thống kê</div>
            <div class="breadcrumb-item">
                <a href="/stats/resident-changes" use:link>
                    <span>Lịch sử thay đổi nhân khẩu</span>
                </a>
            </div>
            {#if household}
                <div class="breadcrumb-item">Hộ khẩu số {household?.number ?? ""}</div>
            {/if}
        </nav>
    </header>

    <div class="flex m-b-sm">
        <div class="flex-fill" />
        <button
            type="button"
            class="btn btn-outline"
            on:click={() =>
                filterByHouseholdFormPanel?.show(
                    household ? new Record({ household: household.id }) : undefined
                )}
        >
            <i class="ri-filter-line" />
            <span class="txt">Lọc theo hộ khẩu</span>
        </button>
    </div>

    <Table
        {isLoading}
        {records}
        fields={[
            {
                name: "name",
                label: "Họ và tên",
            },

            {
                name: "change_type",
                label: "Thay đổi",
            },
            {
                name: "old_address",
                label: "Từ",
            },
            {
                name: "new_address",
                label: "Tới",
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={filterByHouseholdFormPanel}
    title="Filter"
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
    on:submit={(e) => {
        replace(`/stats/resident-changes?household-id=${e.detail.get("household")}`);
    }}
/>
