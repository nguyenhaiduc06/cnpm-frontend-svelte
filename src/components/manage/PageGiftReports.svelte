<script>
    import { replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGiftReport } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import FormPanel from "../base/FormPanel.svelte";
    import BulkBar from "../base/BulkBar.svelte";

    let addGiftReportFormPanel;

    let isLoading;
    let records = [];
    let bulkSelected;

    load();

    async function load() {
        isLoading = true;
        records = await Api.getGiftReports();
        isLoading = false;
    }

    async function deleteSelected() {
        const selectedIds = Object.keys(bulkSelected);
        await Promise.all(selectedIds.map((id) => Api.deleteGiftReportById(id)));
        bulkSelected = {};
        load();
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Các danh sách trao quà</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addGiftReportFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm danh sách trao quà</span>
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
        on:select={(e) => replace(`/manage/gifts?gift-report-id=${e.detail.id}`)}
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
    bind:this={addGiftReportFormPanel}
    title="Tạo danh sách trao quà mới"
    fields={CollectionGiftReport.schema}
    on:submit={(e) => {
        Api.createGiftReport(e.detail).then(load);
    }}
/>
