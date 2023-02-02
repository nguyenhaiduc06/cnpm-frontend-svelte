<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionResidentSnapshots } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { getResidents } from "@/services/api";
    import { fly } from "svelte/transition";

    $: reactiveParams = new URLSearchParams($querystring);
    $: householdId = reactiveParams.get("householdId") || "";

    let residentsTable;
    let addResidentFormPanel;
    let updateResidentFormPanel;
    let addHouseholdFormPanel;
    let selectHouseholdFormPanel;
    let filterFormPanel;

    let isLoading = true;
    let residents;
    let selectedResidents = {};
    $: totalSelectedResidents = Object.keys(selectedResidents).length;

    $: householdId, load();

    function load() {
        isLoading = true;
        getResidents(householdId).then((result) => {
            residents = result.map((record) => {
                return {
                    id: record.id,
                    name: record.expand.resident?.name,
                    household: record.household,
                };
            });
            isLoading = false;
        });
    }

    function updateFilter(filter) {
        const { household } = filter;
        if (!household) {
            return;
        }
        replace(`/manage/residents?householdId=${household}`);
    }

    function addResident(data) {}

    function updateResident(data) {}

    function changeHousehold(data) {}

    function splitIntoNewHousehold(data) {}

    function maskAsDead(data) {}
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Nhân khẩu</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsTable?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Đăng kí thường trú</span>
        </button>
        <button type="button" class="btn btn-outline" on:click={() => addResidentFormPanel?.show()}>
            <i class="ri-history-line" />
            <span class="txt">Lịch sử thay đổi</span>
        </button>
        <a class="btn btn-outline" href="/manage/residents/report" use:link>
            <i class="ri-pie-chart-line" />
            <span class="txt">Thống kê</span>
        </a>
        <div class="flex-fill" />
        <button type="button" class="btn btn-outline" on:click={() => filterFormPanel.show()}>
            <i class="ri-filter-line" />
            <span class="txt">{householdId ? `Hộ khẩu ${householdId}` : "Tất cả hộ khẩu"}</span>
        </button>
    </div>

    <Table
        records={residents}
        fields={[
            {
                name: "name",
                label: "Họ và tên",
            },
            {
                name: "household",
                label: "Hộ khẩu",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedResidents}
        on:select={(e) => updateResidentFormPanel?.show(e.detail)}
    />

    {#if totalSelectedResidents}
        <div class="bulkbar" transition:fly|local={{ duration: 150, y: 5 }}>
            <div class="txt">
                Selected <strong>{totalSelectedResidents}</strong>
                {totalSelectedResidents === 1 ? "record" : "records"}
            </div>
            <div class="flex-fill" />
            <button
                type="button"
                class="btn btn-sm btn-secondary"
                on:click={() => addHouseholdFormPanel?.show()}
            >
                <span class="txt">Tách khẩu</span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-secondary"
                on:click={() => selectHouseholdFormPanel?.show()}
            >
                <span class="txt">Chuyển khẩu</span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-secondary btn-danger"
                on:click={() => maskAsDead(selectedResidents)}
            >
                <span class="txt">Khai tử</span>
            </button>
        </div>
    {/if}
</PageWrapper>

<!-- update fields props to display necessary fields in form -->
<FormPanel
    bind:this={addResidentFormPanel}
    title="Đăng kí thường trú"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["resident"].includes(s.name))}
    on:submit={(e) => addResident(e.detail)}
/>

<FormPanel
    bind:this={updateResidentFormPanel}
    title="Cập nhật thông tin nhân khẩu"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["resident"].includes(s.name))}
    on:submit={(e) => updateResident(e.detail)}
/>

<FormPanel
    bind:this={addHouseholdFormPanel}
    title="Tạo hộ khẩu mới"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["resident"].includes(s.name))}
    on:submit={(e) => splitIntoNewHousehold(e.detail)}
/>

<FormPanel
    bind:this={selectHouseholdFormPanel}
    title="Chọn hộ khẩu chuyển đến"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["resident"].includes(s.name))}
    on:submit={(e) => changeHousehold(e.detail)}
/>

<FormPanel
    bind:this={filterFormPanel}
    title="Filter"
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
    on:submit={(e) => updateFilter(e.detail)}
/>
