<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGift } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import GiftUpsertPanel from "./GiftUpsertPanel.svelte";
    import { Api } from "@/services/api";
    import Table from "../base/Table.svelte";
    import CommonHelper from "@/utils/CommonHelper";
    import BulkBar from "../base/BulkBar.svelte";
    import CustomSearchBar from "../base/CustomSearchBar.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("giftreport") || "";
    $: year = reactiveParams.get("year") || "";
    $: occasion = reactiveParams.get("occasion") || "";
    $: household = reactiveParams.get("household") || "";

    let residentUpsertPanel;
    let residentsList;
    let giftSelectPanel;
    let filter;
    let selectedRecords = [];

    $: records = [];
    $: baseRecords = [];
    $: residents_snaps = [];
    let isLoading;

    $: filter = reportId ? `household ="${household}"` : "";
    load();
    async function load() {
        reactiveParams = new URLSearchParams($querystring);
        reportId = reactiveParams.get("giftreport") || "";
        year = reactiveParams.get("year") || "";
        occasion = reactiveParams.get("occasion") || "";
        household = reactiveParams.get("household") || "";
        isLoading = true;

        let giftResidents = await Api.getGifts(reportId);
        residents_snaps = (await Api.getAllResidents()).filter(
            (x) => giftResidents.find((n) => n.resident == x.resident) && x.household == household
        );

        giftResidents = giftResidents.filter((x) => residents_snaps.find((n) => n.resident == x.resident));
        for (let gift of giftResidents) {
            let residentName = gift.expand.resident.name;
            gift.residentName = residentName;
            gift.cost = gift.num_gift * CommonHelper.costPerGift;
            gift.occasion = occasion;
        }

        isLoading = false;
        records = giftResidents;
        baseRecords = [...giftResidents];
    }
    async function deleteSelected(){
        const gifts = Object.values(selectedRecords);
        const deleteTasks = gifts.map((x) => Api.deleteGift(x.id));
        selectedRecords = {};
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
                <div class="breadcrumb-item">
                    C??c ph???n th?????ng c???a h??? {household} trong d???p {occasion} n??m {year}
                </div>
            {:else}
                <span class="txt">T???t c??? h??? kh???u</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Th??m trao qu??</span>
            </button>
        </div>
    </div>
    
    <CustomSearchBar 
        searchField="residentName"
        placeholder="T??m nh??n kh???u (nh???p t??n)"
        on:submit={(e) => {
            const searchKey = e.detail.residentName;
            records = baseRecords.filter(x => x.residentName.includes(searchKey))
        }}
        on:clear={(e) => {
            records = [...baseRecords]
        }}
    />
    
    <Table
        records={records}
        fields={[
            {
                name: "residentName",
                label: "T??n nh??n kh???u",
            },
            {
                name: "num_gift",
                label: "S??? qu?? nh???n",
            },
            {
                name: "cost",
                label: "Chi ph??",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedRecords}
        on:select={(e) => giftSelectPanel?.show(e?.detail)}
    />
    <BulkBar
        bulkSelected={selectedRecords}
        actions={[{ label: "X??a", onClick: deleteSelected, isDanger: true }]}
    />
</PageWrapper>

<GiftUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionGift}
    excludedFields={["gift_report"]}
    excludedVal={[reportId]}
    {household}
    on:save={() => load()}
    on:delete={() => load()}
    on:create={(e) => console.log("???? create record with data", e.detail.number)}
    on:update={(e) => console.log("???? update record with data", e.detail)}
/>

<FormPanel
    bind:this={giftSelectPanel}
    on:submit={async (e) => {
        const {gift_report, num_gift, resident, id} = e.detail;
        await Api.updateGift(id, {gift_report, num_gift, resident})
        load();
    }}
    fields={[
        {
            name: "resident",
            type: "relation",
            options: {
                maxSelect: 1,
                collectionId: "residents",  
            },
        },
        {
            name: "gift_report",
            type: "relation",
            options: {
                maxSelect: 1,
                collectionId: "pzgz9wrl4rk10kq",
            },
        },
        {
            name: "num_gift",
            type: "number",
        },
    ]}
    excludedFields={{
        resident: {
            fieldName: "resident",
            defaultVal: undefined
        },
        gift_report:{
            fieldName: "gift_report",
            defaultVal: reportId
        }
    }}
/>
