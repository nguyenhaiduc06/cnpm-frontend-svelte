<script>
    import { replace } from "svelte-spa-router";
    import Searchbar from "@/components/base/Searchbar.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import RecordsList from "@/components/records/RecordsList.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionHouseholds } from "../../utils/database/collections";
    import { CollectionRewardReport } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import FormPanel from "../base/FormPanel.svelte";
    import BulkBar from "../base/BulkBar.svelte";

    let addRewardReportFormPanel;

    let isLoading;
    let records = [];
    let bulkSelected;

    load();

    async function load() {
        isLoading = true;
        records = await Api.getRewardReports();
        isLoading = false;
    }

    async function deleteSelected() {
        const selectedIds = Object.keys(bulkSelected);
        await Promise.all(selectedIds.map((id) => Api.deleteRewardReportById(id)));
        bulkSelected = {};
        load();
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Các danh sách khen thưởng</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addRewardReportFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm danh sách khen thưởng</span>
        </button>
    </div>

    <Table
        {isLoading}
        {records}
        bind:bulkSelected
        fields={[
            {
                name: "name",
                label: "Tên danh sách",
            },
        ]}
        on:select={(e) => replace(`/manage/rewards?reward-report-id=${e.detail.id}`)}
    />

    <BulkBar
        {bulkSelected}
        actions={[
            {
                label: "Xóa",
                onClick: deleteSelected,
                isDanger: true,
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={addRewardReportFormPanel}
    title="Tạo danh sách khen thưởng mới"
    fields={CollectionRewardReport.schema}
    on:submit={(e) => Api.createRewardReport(e.detail).then(load)}
/>
