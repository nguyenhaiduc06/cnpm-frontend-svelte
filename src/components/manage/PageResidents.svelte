<script>
    import { link, querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
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

    $: filter = householdId ? `household ="${householdId}"` : "";
    let isLoading = true;
    let residents;
    let selectedResidents = {};
    $: totalSelectedResidents = Object.keys(selectedResidents).length;

    $: householdId, load();

    function load() {
        isLoading = true;
        Api.getResidents(householdId).then((result) => {
            console.log(result);
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
            addSuccessToast(`???? ????ng k?? th?????ng tr?? th??nh c??ng cho ${name}`);
        } catch (e) {
            addErrorToast(e.message);
        }
    }

    function updateResident({ record, data }) {
        const residentSnapshotCollectionId = "s4r3ipyouaoe4eo";
        ApiClient.collection(residentSnapshotCollectionId).update(record.id, data);
    }

    async function changeHousehold(data) {
        const bulkSelected = selectedResidents;
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
            addSuccessToast(`???? chuy???n kh???u th??nh c??ng`);
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
            addSuccessToast(`???? t??ch kh???u th??nh c??ng`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }

    async function maskAsDead(data) {
        //TODO: alert
        const bulkSelected = selectedResidents;
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
            addSuccessToast(`???? khai t???`);
        } catch (error) {
            addErrorToast(e.message);
        }
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Qu???n l??</div>
            <div class="breadcrumb-item">Th?????ng tr??</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsTable?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addResidentFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">????ng k?? th?????ng tr??</span>
        </button>
        <a class="btn btn-outline" href="/manage/residents/historyChange" use:link>
            <i class="ri-history-line" />
            <span class="txt">L???ch s??? thay ?????i</span>
        </a>
        <a class="btn btn-outline" href="/manage/residents/report" use:link>
            <i class="ri-pie-chart-line" />
            <span class="txt">Th???ng k??</span>
        </a>
        <div class="flex-fill" />
        <button type="button" class="btn btn-outline" on:click={() => filterFormPanel.show()}>
            <i class="ri-filter-line" />
            <span class="txt">{householdId ? `H??? kh???u ${householdId}` : "T???t c??? h??? kh???u"}</span>
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
                label: "H??? v?? t??n",
            },
            {
                name: "birthday",
                label: "Ng??y sinh",
            },
            {
                name: "number",
                label: "H??? kh???u s???",
            },
            {
                name: "address",
                label: "?????a ch???",
            },
            {
                name: "relation_with_householder",
                label: "Quan h??? v???i ch??? h???",
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
                <span class="txt">T??ch kh???u</span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-secondary"
                on:click={() => selectHouseholdFormPanel?.show()}
            >
                <span class="txt">Chuy???n kh???u</span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-secondary btn-danger"
                on:click={() => maskAsDead(selectedResidents)}
            >
                <span class="txt">Khai t???</span>
            </button>
        </div>
    {/if}
</PageWrapper>

<!-- <RecordUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionResidentSnapshots}
    on:save={() => residentsList?.reloadLoadedPages()}
    on:delete={() => residentsList?.reloadLoadedPages()}
    on:create={(e) => createResident(e.detail)}
    on:update={(e) => updateResident(e.detail)}
/>

<RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionHouseholds}
    on:save={() => residentsList?.reloadLoadedPages()}
    on:delete={() => residentsList?.reloadLoadedPages()}
    on:create={(e) => splitHousehold(e.detail)}
    on:update={(e) => console.log("???? update record with data", e.detail)}
/> -->
<FormPanel
    bind:this={addResidentFormPanel}
    title="????ng k?? th?????ng tr??"
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
    title="C???p nh???t th??ng tin nh??n kh???u"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["resident"].includes(s.name))}
    on:submit={(e) => updateResident(e.detail)}
/>

<FormPanel
    bind:this={addHouseholdFormPanel}
    title="T???o h??? kh???u m???i"
    fields={CollectionHouseholds.schema}
    on:submit={(e) => splitIntoNewHousehold(e.detail)}
/>

<FormPanel
    bind:this={selectHouseholdFormPanel}
    title="Ch???n h??? kh???u chuy???n ?????n"
    fields={CollectionResidentSnapshots.schema.filter((s) => ["household"].includes(s.name))}
    on:submit={(e) => changeHousehold(e.detail)}
/>

<FormPanel
    bind:this={filterFormPanel}
    title="Filter"
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
    on:submit={(e) => updateFilter(e.detail)}
/>
