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
    $: householdId = reactiveParams.get("household-id");
    let household;
    $: if (householdId) {
        Api.getHouseholdById(householdId).then((record) => (household = record));
    } else {
        household = undefined;
    }

    let addResidentFormPanel;
    let updateResidentFormPanel;
    let addHouseholdFormPanel;
    let selectHouseholdFormPanel;
    let filterByHouseholdFormPanel;

    let isLoading = true;
    let search;
    let records = [];
    $: regex = new RegExp(`${search}.*`);
    $: filteredRecords = records.filter((r) => {
        const { name, citizen_id, address } = r;
        return (
            name.toLowerCase().match(regex) ||
            citizen_id.toLowerCase().match(regex) ||
            address.toLowerCase().match(regex)
        );
    });
    let bulkSelected;
    $: console.log("🚀 ~ bulkSelected", bulkSelected);

    $: householdId, load();

    async function load() {
        isLoading = true;
        const filter = householdId ? `active = true && household ~ "${householdId ?? ""}"` : "active = true";
        records = await Api.getPermanentResidents({ filter });
        isLoading = false;
    }

    function filterByHousehold(data) {
        const householdId = data.get("household");
        if (!householdId) {
            return;
        }
        replace(`/manage/permanent?household-id=${householdId}`);
    }

    async function registerPermanent(data) {
        try {
            const resident = await Api.createResident(data);
            data.set("resident", resident.id);
            data.set("alive", true);
            data.set("active", true);
            await Api.createResidentSnapshot(data);
            load();
            addSuccessToast(`Đã đăng kí thường trú thành công cho ${data.get("name")}`);
        } catch (e) {
            addErrorToast(e.message);
        }
    }

    function updateResident({ record, data }) {
        const residentSnapshotCollectionId = "s4r3ipyouaoe4eo";
        ApiClient.collection(residentSnapshotCollectionId).update(record.id, data);
    }

    async function changeHousehold(changeData) {
        const selectedSnapshots = Object.values(bulkSelected);

        for (const snapshot of selectedSnapshots) {
            if (snapshot.household != selectedSnapshots[0].household) {
                addErrorToast("Các nhân khẩu đã chọn không cùng một hộ");
                return;
            }
        }

        const newHousehold = changeData.get("household");
        const relationWithNewHouseholder = changeData.get("relation_with_householder");

        try {
            await Promise.all(
                selectedSnapshots.map((snapshot) => {
                    Api.changeSnapshotHousehold(snapshot, {
                        household: newHousehold,
                        relation_with_householder: relationWithNewHouseholder,
                    });
                })
            );
            bulkSelected = {};
            load();
            addSuccessToast(`Đã chuyển khẩu thành công`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }

    async function splitIntoNewHousehold(newHouseholdData) {
        const selectedSnapshots = Object.values(bulkSelected);

        for (const snapshot of selectedSnapshots) {
            if (snapshot.household != selectedSnapshots[0].household) {
                addErrorToast("Các nhân khẩu đã chọn không cùng một hộ");
                return;
            }
        }

        try {
            const newHousehold = await Api.createHousehold(newHouseholdData);
            await Promise.all(
                selectedSnapshots.map((snapshot) => {
                    Api.splitSnapshotHousehold(snapshot, { household: newHousehold.id });
                })
            );
            bulkSelected = {};
            load();
            addSuccessToast(`Đã tách khẩu thành công`);
        } catch (e) {
            addErrorToast(e.message);
        }
    }

    async function markSelectedAsDead() {
        const selectedSnapshots = Object.values(bulkSelected);
        try {
            await Promise.all(selectedSnapshots.map((snapshot) => Api.maskSnapshotAsDead(snapshot)));
            bulkSelected = {};
            load();
            addSuccessToast(`Đã khai tử`);
        } catch (e) {
            addErrorToast(e.message);
        }
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">
                <a href="/manage/permanent" use:link>
                    <span>Thường trú</span>
                </a>
            </div>
            {#if household}
                <div class="breadcrumb-item">Hộ khẩu số {household?.number ?? ""}</div>
            {/if}
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Đăng kí thường trú</span>
        </button>
        <div class="flex-fill" />
        <button type="button" class="btn btn-outline" on:click={() => filterByHouseholdFormPanel.show()}>
            <i class="ri-filter-line" />
            <span class="txt">Lọc theo hộ khẩu</span>
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
                name: "gender",
                label: "Giới tính",
            },
            {
                name: "birthday",
                label: "Ngày sinh",
                type: "date",
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
            {
                name: "note",
                label: "Ghi chú",
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
                onClick: markSelectedAsDead,
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
    fields={CollectionResidentSnapshots.schema.filter((s) =>
        ["household", "relation_with_householder"].includes(s.name)
    )}
    on:submit={(e) => changeHousehold(e.detail)}
/>

<FormPanel
    bind:this={filterByHouseholdFormPanel}
    title="Filter"
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
    on:submit={(e) => filterByHousehold(e.detail)}
/>
