<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import {
        CollectionHouseholds,
        CollectionResidents,
        CollectionResidentSnapshots,
    } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import ApiClient from "@/utils/ApiClient";

    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import { addErrorToast, addSuccessToast } from "@/stores/toasts";
    import BulkBar from "../base/BulkBar.svelte";
    import { Record } from "pocketbase";
    import Searchbar from "../base/Searchbar.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: householdId = reactiveParams.get("householdId") || "";

    let addResidentFormPanel;
    let updateResidentFormPanel;
    let addHouseholdFormPanel;
    let selectHouseholdFormPanel;
    let filterByHouseholdFormPanel;

    let isLoading = true;
    let search;
    let records = [];
    $: regex = new RegExp(`${search}.*`);
    $: console.log(regex, "abc".match(regex))
    $: filteredRecords = records.filter((r) => {
        const { name, citizen_id, address } = r;
        return name.toLowerCase().match(regex) || citizen_id.toLowerCase().match(regex) || address.toLowerCase().match(regex);
    });
    let bulkSelected;

    load();

    async function load() {
        isLoading = true;
        records = await Api.getPermanentResidents({ filter: "active = true" });
        isLoading = false;
    }

    function filterByHousehold(householdId) {
        if (!householdId) {
            return;
        }
        replace(`/manage/residents?householdId=${householdId}`);
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

    function updateResident({ record, data }) {
        const residentSnapshotCollectionId = "s4r3ipyouaoe4eo";
        ApiClient.collection(residentSnapshotCollectionId).update(record.id, data);
    }

    async function changeHousehold(data) {
        try {
            const { household } = data;
            await Promise.all(
                Object.keys(bulkSelected).map(async (recordId) => {
                    const record = await Api.getResidentSnapshot(recordId);
                    await Api.updateResidentSnapshot(recordId, {
                        ...record,
                        active: false,
                    });
                    const residentSnapshot = await Api.createResidentSnapshot({
                        resident: record.resident,
                        household,
                        relation_with_householder: record.relation_with_householder,
                        alive: true,
                        note: record.note,
                        active: true,
                    });

                    const residentChange = await Api.createResidentChange({
                        resident: record.resident,
                        old_household: record.household,
                        new_household: household,
                        old_snapshot: recordId,
                        new_snapshot: residentSnapshot.id,
                        change_type: "change-household",
                    });
                })
            );
            addSuccessToast(`Đã chuyển khẩu thành công`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }

    async function splitIntoNewHousehold(data) {
        const bulkSelected = selectedResidents;
        try {
            const newHousehold = await Api.createHousehold(data);
            await Promise.all(
                Object.keys(bulkSelected).map(async (recordId) => {
                    const record = await Api.getResidentSnapshot(recordId);
                    await Api.updateResidentSnapshot(recordId, {
                        ...record,
                        active: false,
                    });
                    const residentSnapshot = await Api.createResidentSnapshot({
                        resident: record.resident,
                        household: newHousehold.id,
                        relation_with_householder: record.relation_with_householder,
                        alive: true,
                        note: record.note,
                        active: true,
                    });

                    const residentChange = await Api.createResidentChange({
                        resident: record.resident,
                        old_household: record.household,
                        new_household: newHousehold.id,
                        old_snapshot: recordId,
                        new_snapshot: residentSnapshot.id,
                        change_type: "split-household",
                    });
                })
            );
            addSuccessToast(`Đã tách khẩu thành công`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }

    async function markAsDead(data) {
        //TODO: alert
        try {
            const { household } = data;
            await Promise.all(
                Object.keys(bulkSelected).map(async (recordId) => {
                    const record = await Api.getResidentSnapshot(recordId);
                    await Api.updateResidentSnapshot(recordId, {
                        ...record,
                        active: false,
                    });
                    const residentSnapshot = await Api.createResidentSnapshot({
                        resident: record.resident,
                        household: record.household,
                        relation_with_householder: record.relation_with_householder,
                        alive: true,
                        note: "dead",
                        active: true,
                    });

                    const residentChange = await Api.createResidentChange({
                        resident: record.resident,
                        old_household: record.household,
                        new_household: record.household,
                        old_snapshot: recordId,
                        new_snapshot: residentSnapshot.id,
                        change_type: "dead",
                    });
                })
            );
            addSuccessToast(`Đã khai tử`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Thường trú</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Đăng kí thường trú</span>
        </button>
        <a class="btn btn-outline" href="/manage/residents/historyChange" use:link>
            <i class="ri-history-line" />
            <span class="txt">Lịch sử thay đổi</span>
        </a>
        <a class="btn btn-outline" href="/manage/residents/report" use:link>
            <i class="ri-pie-chart-line" />
            <span class="txt">Thống kê</span>
        </a>
        <div class="flex-fill" />
        <button type="button" class="btn btn-outline" on:click={() => filterByHouseholdFormPanel.show()}>
            <i class="ri-filter-line" />
            <span class="txt">{householdId ? `Hộ khẩu ${householdId}` : "Tất cả hộ khẩu"}</span>
        </button>
    </div>

    <Searchbar placeholder="Tìm kiếm theo tên, CCCD, địa chỉ" bind:value={search} />

    <Table
        {isLoading}
        records={filteredRecords}
        bind:bulkSelected
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
        on:select={(e) => updateResidentFormPanel?.show(e.detail)}
    />

    <BulkBar
        {bulkSelected}
        actions={[
            {
                label: "Tách khẩu",
                onClick: () => addHouseholdFormPanel?.show(),
            },
            {
                label: "Chuyển khẩu",
                onClick: () => selectHouseholdFormPanel?.show(),
            },
            {
                label: "Khai tử",
                onClick: () => markAsDead(bulkSelected),
                isDanger: true,
            },
        ]}
    />
</PageWrapper>

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
    fields={CollectionHouseholds.schema}
    on:submit={(e) => splitIntoNewHousehold(e.detail)}
/>

<FormPanel
    bind:this={selectHouseholdFormPanel}
    title="Chọn hộ khẩu chuyển đến"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["household"].includes(s.name))}
    on:submit={(e) => changeHousehold(e.detail)}
/>

<FormPanel
    bind:this={filterByHouseholdFormPanel}
    title="Filter"
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
    on:submit={(e) => filterByHousehold(e.detail.household)}
/>
