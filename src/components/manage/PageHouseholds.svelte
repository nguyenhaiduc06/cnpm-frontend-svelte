<script>
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionHouseholds } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import FormPanel from "../base/FormPanel.svelte";
    import { Api } from "@/services/api";
    import { addErrorToast, addSuccessToast } from "@/stores/toasts";
    import BulkBar from "../base/BulkBar.svelte";
    import Searchbar from "../base/Searchbar.svelte";

    let addHouseholdFormPanel;

    let isLoading;
    let households;
    let selectedHouseholds = {};
    let search = "";
    $: filter = search ? `number ~ "${search}" || address ~ "${search}"` : "";

    $: load({ filter });

    async function load({ filter }) {
        isLoading = true;
        households = await Api.getHouseholds({ filter });
        isLoading = false;
    }

    async function addHousehold(data) {
        try {
            await Api.createHousehold(data);
            addSuccessToast(`Đã thêm hộ khẩu số ${data.number}`);
            load();
        } catch (e) {
            addErrorToast(e.message);
        } finally {
        }
    }

    async function deleteSelectedHouseholds() {
        const households = Object.values(selectedHouseholds);
        const deleteTasks = households.map((household) => Api.deleteHousehold(household));
        selectedHouseholds = {};
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
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Hộ khẩu</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addHouseholdFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Nhập sổ hộ khẩu</span>
        </button>
        <div class="flex-fill" />
        <!-- <button type="button" class="btn btn-outline" on:click={() => {}}>
            <i class="ri-filter-line" />
            <span class="txt">Lọc</span>
        </button> -->
    </div>

    <Searchbar placeholder="Tìm hộ khẩu theo số, địa chỉ" bind:value={search} />

    <Table
        records={households}
        fields={[
            {
                name: "number",
                label: "Số",
            },
            {
                name: "address",
                label: "Địa chỉ",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedHouseholds}
    />

    <BulkBar
        bulkSelected={selectedHouseholds}
        actions={[{ label: "Xóa", onClick: deleteSelectedHouseholds, isDanger: true }]}
    />
</PageWrapper>

<FormPanel
    bind:this={addHouseholdFormPanel}
    title="Nhập sổ hộ khẩu"
    fields={CollectionHouseholds.schema.filter((s) => ["number", "address"].includes(s.name))}
    on:submit={(e) => addHousehold(e.detail)}
/>
