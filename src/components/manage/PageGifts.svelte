<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGift } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import { link, replace } from "svelte-spa-router";
    import { Record } from "pocketbase";

    $: reactiveParams = new URLSearchParams($querystring);

    $: giftReportId = reactiveParams.get("gift-report-id");
    let giftReport;
    $: if (giftReportId) {
        Api.getGiftReportById(giftReportId).then((record) => (giftReport = record));
    } else {
        giftReport = undefined;
    }

    $: householdId = reactiveParams.get("household-id");
    let household;
    $: if (householdId) {
        Api.getHouseholdById(householdId).then((record) => (household = record));
    } else {
        household = undefined;
    }

    let addGiftFormPanel;
    let filterByHouseholdFormPanel;

    let isLoading;
    let records = [];
    let bulkSelected;

    $: totalGiftAmount = records.filter((record) => record.gift_type).length;

    $: giftReportId, householdId, load();

    async function load() {
        isLoading = true;
        records = await Api.getGifts({
            filter: `gift_report ~ "${giftReportId ?? ""}" && household ~ "${householdId ?? ""}"`,
        });
        isLoading = false;
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">
                <a href="/manage/gift-reports" use:link>
                    <span>Trao quà</span>
                </a>
            </div>
            <div class="breadcrumb-item">
                <a href={`/manage/gifts?gift-report-id=${giftReport?.id}`} use:link>
                    <span>{giftReport?.name ?? ""}</span>
                </a>
            </div>
            {#if household}
                <div class="breadcrumb-item">Hộ khẩu số {household?.number ?? ""}</div>
            {/if}
        </nav>
    </header>

    <div class="m-b-sm">
        <h1>Tổng số lượng phần quà: {totalGiftAmount}</h1>
    </div>

    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addGiftFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm trao quà</span>
        </button>
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
        bind:bulkSelected
        fields={[
            {
                name: "name",
                label: "Họ và tên",
            },
            {
                name: "address",
                label: "Địa chỉ",
            },
            {
                name: "gift_type",
                label: "Phần quà",
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={addGiftFormPanel}
    title="Thêm khen thưởng"
    fields={CollectionGift.schema}
    on:submit={(e) => {
        const giftData = e.detail;
        giftData.set("gift_report", giftReport?.id);
        Api.createGift(e.detail).then(load);
    }}
/>

<FormPanel
    bind:this={filterByHouseholdFormPanel}
    title="Chọn hộ khẩu"
    fields={CollectionGift.schema.filter((field) => ["household"].includes(field.name))}
    on:submit={(e) => {
        replace(`/manage/gifts?gift-report-id=${giftReport?.id}&household-id=${e.detail.get("household")}`);
    }}
/>
