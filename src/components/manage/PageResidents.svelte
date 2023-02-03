<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionResidents, CollectionResidentSnapshots } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import { fly } from "svelte/transition";
    import { addErrorToast, addSuccessToast } from "@/stores/toasts";

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
        Api.getResidents(householdId).then((result) => {
            residents = result.map((record) => {
                const { id, relation_with_householder } = record;
                const { resident, household } = record.expand;
                const { name, birthday, citizen_id } = resident ?? {};
                const { number, address } = household ?? {};
                return {
                    id,
                    name,
                    birthday,
                    number,
                    address,
                    citizen_id,
                    relation_with_householder,
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

    async function registerPermanent(data) {
        const { name, birthday, gender, citizen_id, household, relation_with_householder } = data;
        try {
            const resident = await Api.createResident({ name, birthday, gender, citizen_id });
            await Api.createResidentSnapshot({
                resident: resident.id,
                household,
                relation_with_householder,
                alive: true,
                note: "",
                active: true,
            });
            addSuccessToast(`Đã đăng kí thường trú thành công cho ${name}`);
        } catch (e) {
            addErrorToast(e.message);
        }
    }

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
            <div class="breadcrumb-item">Thường trú</div>
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
                name: "citizen_id",
                label: "CCCD",
            },
            {
                name: "name",
                label: "Họ và tên",
            },
            {
                name: "birthday",
                label: "Ngày sinh",
            },
            {
                name: "number",
                label: "Hộ khẩu số",
            },
            {
                name: "address",
                label: "Địa chỉ",
            },
            {
                name: "relation_with_householder",
                label: "Quan hệ với chủ hộ",
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
    fields={[
        ...CollectionResidents.schema.filter((s) =>
            ["name", "birthday", "gender", "citizen_id"].includes(s.name)
        ),
        ...CollectionResidentSnapshots.schema.filter((s) =>
            ["household", "relation_with_householder"].includes(s.name)
        ),
    ]}
    on:submit={(e) => registerPermanent(e.detail)}
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
