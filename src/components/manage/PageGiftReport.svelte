<script>
    import { push } from "svelte-spa-router";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGiftReport } from "../../utils/database/collections";
    import GiftReportSearchBar from "../base/GiftReportSearchBar.svelte";
    import { Api } from "@/services/api";
    import Table from "../base/Table.svelte";
    import BulkBar from "../base/BulkBar.svelte";

    let filter;
    let giftReportUpsert;
    let isLoading;
    let reportRecords;
    let selectedReports = {};

    load();

    async function load() {
        isLoading = true;
        reportRecords = await Api.getGiftReports();
        isLoading = false;
    }
    async function deleteSelectedHouseholds() {
        const reports = Object.values(selectedReports);
        const deleteTasks = reports.map((report) => Api.deleteGiftReport(report));
        selectedReports = {};
        Promise.all(deleteTasks)
            .then(() => {
                load();
            })
            .catch((e) => {
                addErrorToast(e.message);
            });
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Collections</div>
            <div class="breadcrumb-item">Gift Reports</div>
        </nav>

        <div class="inline-flex gap-5">
            <RefreshButton on:refresh={() => load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            <div class="breadcrumb-item">Danh sách các dịp trao quà</div>   
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => giftReportUpsert?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Thêm dịp trao quà</span>
            </button>
        </div>
    </div>
    <GiftReportSearchBar
        autocompleteCollection={CollectionGiftReport}
        searchField="occasion"
        placeholder="Tìm dịp trao quà"
        on:submit={(e) => (filter = e.detail)}
    />
    <Table
        records={reportRecords}
        fields={[
            {
                name: "occasion",
                label: "Dịp",
            },
            {
                name: "year",
                label: "Năm",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedReports}
        on:select={(e) =>
            push(
                `/manage/gift?giftreport=${e.detail.id}&occasion=${e.detail.occasion}&year=${e.detail.year}`
            )}
    />
    <BulkBar
        bulkSelected={selectedReports}
        actions={[{ label: "Xóa", onClick: deleteSelectedHouseholds, isDanger: true }]}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={giftReportUpsert}
    collection={CollectionGiftReport}
    on:save={() => load()}
    on:delete={() => load()}
/>
