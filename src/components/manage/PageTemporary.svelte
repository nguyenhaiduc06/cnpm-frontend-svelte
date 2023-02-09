<script>
    import { CollectionTemporaryResidents } from "@/utils/database/collections";
    import PageWrapper from "../base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import FormPanel from "../base/FormPanel.svelte";
    import { addSuccessToast } from "@/stores/toasts";

    let addTemporaryResidentFormPanel;
    let isLoading;
    let records;

    load();

    async function load() {
        isLoading = true;
        records = await Api.getTemporaryResidents();
        isLoading = false;
    }

    async function addTemporaryResident(data) {
        await Api.createTemporaryResident(data);
        addSuccessToast("Đã đăng ký tạm trú");
        load();
    }
</script>

<ManageSidebar />
<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Tạm trú</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addTemporaryResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Đăng kí tạm trú</span>
        </button>
    </div>

    <Table
        {isLoading}
        {records}
        fields={[
            {
                name: "name",
                label: "Tên",
            },
            {
                name: "from",
                label: "Từ ngày",
                type: "date",
            },
            {
                name: "to",
                label: "Tới ngày",
                type: "date",
            },
            {
                name: "address",
                label: "Địa chỉ tạm trú",
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={addTemporaryResidentFormPanel}
    title="Đăng ký tạm trú"
    fields={CollectionTemporaryResidents.schema}
    on:submit={(e) => addTemporaryResident(e.detail)}
/>
