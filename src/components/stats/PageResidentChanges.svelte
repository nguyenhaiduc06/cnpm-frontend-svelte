<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import StatsSidebar from "./StatsSidebar.svelte";

    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";

    $: reactiveParams = new URLSearchParams($querystring);
    $: householdId = reactiveParams.get("householdId") || "";

    let isLoading;
    let records;

    $: householdId, load();

    async function load() {
        isLoading = true;
        records = await Api.getResidentChanges({ filter: "" });
        isLoading = false;
    }
</script>

<StatsSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Thống kê</div>
            <div class="breadcrumb-item">Lịch sử thay đổi nhân khẩu</div>
        </nav>
    </header>

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
