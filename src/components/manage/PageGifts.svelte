<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionReward } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";

    $: reactiveParams = new URLSearchParams($querystring);
    $: giftReportId = reactiveParams.get("gift-report-id") || "";
    let giftReport;
    $: Api.getGiftReportById(giftReportId).then((record) => (giftReport = record));

    let addGiftFormPanel;

    let isLoading;
    let records;
    let bulkSelected;

    $: giftReportId, load();

    async function load() {
        isLoading = true;
        records = await Api.getGifts({ filter: `gift_report = '${giftReportId}'` });
        isLoading = false;
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Trao quà</div>
            <div class="breadcrumb-item">{giftReport?.name ?? ""}</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addGiftFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm trao quà</span>
        </button>
    </div>

    <Table
        {isLoading}
        {records}
        bind:bulkSelected
        fields={[
            {
                name: "name",
                label: "Họ và tên",
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={addGiftFormPanel}
    title="Thêm khen thưởng"
    fields={CollectionReward.schema}
    on:submit={(e) => {
        Api.createReward(e.detail);
        load();
    }}
/>
