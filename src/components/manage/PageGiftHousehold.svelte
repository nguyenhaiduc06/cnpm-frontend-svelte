<script>
    import { querystring } from "svelte-spa-router";
    import {  push } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGift } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import GiftUpsertPanel from "./GiftUpsertPanel.svelte";
    import { Api } from "@/services/api";
    import CommonHelper from "@/utils/CommonHelper";
    import Table from "../base/Table.svelte";
    import BulkBar from "../base/BulkBar.svelte";
    import CustomFormPanel from "./CustomFormPanel.svelte";
    import CustomSearchBar from "../base/CustomSearchBar.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("giftreport") || "";
    $: year = reactiveParams.get("year") || "";
    $: occasion = reactiveParams.get("occasion") || "";
    
    let residentUpsertPanel;
    let residentsList;
    let giftSelectPanel;
    let filter;
    let selectedHouseholds = [];
    let isLoading;
    
    $: records = [];
    $: baseRecords = [];
    let giftResidents;
    let residents;
    let households;

    $: filter = reportId ? `gift_report ="${reportId}"` : "";

    load();
    async function load() {
        reactiveParams = new URLSearchParams($querystring);
        reportId = reactiveParams.get("giftreport") || "";
        year = reactiveParams.get("year") || "";
        occasion = reactiveParams.get("occasion") || "";
        isLoading = true;

        giftResidents = await Api.getGifts(reportId);
        residents = (await Api.getAllResidents()).filter((x) =>
            giftResidents.find((n) => n.resident == x.resident)
        );
        records = [];
        households = await Api.getHouseholds({});

        for (let i of residents) {
            let gift = giftResidents.find((x) => x.resident == i.resident);
            let index = records.findIndex((x) => x.householdId == i.household);
            if (index == -1) {
                records.push({
                    householdId: i.household,
                    household: households.find((x) => x.id == i.household).address,
                    gift_received: 1,
                    id: records.length + 1,
                    total_cost: gift ? gift.num_gift * CommonHelper.costPerGift : 0,
                });
            } else {
                records[index].gift_received++;
                records[index].total_cost += gift ? gift.num_gift * CommonHelper.costPerGift : 0;
            }
        }

        //const giftHouseholds = residents.group(({ household }) => household);
        records = records;
        baseRecords = [...records]
        isLoading = false;
    }
    async function deleteSelectedHouseholds() {
        let deleteTask = [];
        for (let i of selectedHouseholds) {
            if (!i) continue;
            let residentsToDelete = residents.filter((x) => x.household == i.householdId);
            let giftToDelete = giftResidents.filter((x) =>
                residentsToDelete.find((n) => n.resident == x.resident)
            );
            for (let gift of giftToDelete) {
                deleteTask.push(Api.deleteGift(gift.id));
            }
        }
        selectedHouseholds = {}
        Promise.all(deleteTask)
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
            <div class="breadcrumb-item">Qu???n l??</div>
            <div class="breadcrumb-item">Danh s??ch ph??t qu??</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            {#if reportId}
                <div class="breadcrumb-item">C??c ph???n th?????ng trong d???p {occasion} n??m {year}</div>
            {:else}
                <span class="txt">T???t c??? h??? kh???u</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => giftSelectPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Th??m trao qu??</span>
            </button>
        </div>
    </div>
    
    <CustomSearchBar
        searchField="household"
        placeholder="T??m h??? kh???u (nh???p ?????a ch???)"
        on:submit={(e) => {
            const searchVal = e.detail.household || "";
            records = baseRecords.filter((x) => x.household.includes(searchVal));
        }}
        on:clear={(e) => {
            records = [...baseRecords]
        }}
    />
    
    <Table
        {records}
        fields={[
            {
                name: "id",
                label: "STT",
            },
            {
                name: "household",
                label: "H??? gia ????nh",
            },
            {
                name: "gift_received",
                label: "S??? th??nh vi??n nh???n qu??",
            },
            {
                name: "total_cost",
                label: "T???ng chi ph??",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedHouseholds}
        on:select={(e) =>
            push(
                `/manage/gift-resident?household=${e.detail.householdId}&giftreport=${reportId}&occasion=${occasion}&year=${year}`
            )}
    />
    <BulkBar
        bulkSelected={selectedHouseholds}
        actions={[{ label: "X??a", onClick: deleteSelectedHouseholds, isDanger: true }]}
    />
</PageWrapper>

<CustomFormPanel
    bind:this={giftSelectPanel}
    fields={[
        {
            name: "household",
            type: "relation",
            options: {
                collectionId: "households",
                maxSelect: 1,
            },
        },
    ]}
    existedHousehold={records.map(x => x.householdId)}
    on:submit={async (e) => {
        let household = e.detail.household;
        records.push({
            householdId: household,
            household: households.find((x) => x.id == household).address,
            gift_received: 0,
            id: records.length + 1,
            total_cost: 0,
        });
        records = records;
    }}
    
/>
