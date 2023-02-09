<script>
    import { CollectionAbsentResidents } from "@/utils/database/collections";
    import PageWrapper from "../base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import FormPanel from "../base/FormPanel.svelte";
    import { addSuccessToast } from "@/stores/toasts";
    import BulkBar from "../base/BulkBar.svelte";

    let addAbsentResidentFormPanel;
    let isLoading;
    let records;
    let bulkSelected;

    load();

    async function load() {
        isLoading = true;
        records = await Api.getAbsentResidents();
        isLoading = false;
    }

    async function addAbsentResident(data) {
        await Api.createAbsentResident(data);
        addSuccessToast(`Đã đăng ký tạm vắng`);
        load();
    }

    async function deleteSelected() {
        const selectedIds = Object.keys(bulkSelected);
        await Promise.all(selectedIds.map((id) => Api.deleteAbsentResidentById(id)));
        bulkSelected = {};
        load();
    }
</script>

<ManageSidebar />
<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Tạm vắng</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addAbsentResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Đăng kí tạm vắng</span>
        </button>
    </div>

    <Table
        {records}
        fields={[
            { name: "name", label: "Tên" },
            {
                name: "from",
                label: "Từ ngày",
                type: "date",
            },
            { name: "to", label: "Tới ngày", type: "date" },
        ]}
        {isLoading}
        bind:bulkSelected
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
    title="Đăng ký tạm vắng"
    bind:this={addAbsentResidentFormPanel}
    fields={CollectionAbsentResidents.schema}
    on:submit={(e) => addAbsentResident(e.detail)}
/>
