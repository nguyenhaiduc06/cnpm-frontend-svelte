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

    $: giftResidents = [];
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

        giftResidents = await Api.getGifts(reportId);
        residents_snaps = (await Api.getAllResidents()).filter(
            (x) => giftResidents.find((n) => n.resident == x.resident) && x.household == household
        );

        giftResidents = giftResidents.filter((x) => residents_snaps.find((n) => n.resident == x.resident));
        for (let gift of giftResidents) {
            let residentName = (await Api.getResidentInfo(gift.resident, false)).name;
            gift.residentName = residentName;
            gift.cost = gift.num_gift * CommonHelper.costPerGift;
            gift.occasion = occasion;
        }

        isLoading = false;
        giftResidents = giftResidents;
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
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Danh sách phát quà</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            {#if reportId}
                <div class="breadcrumb-item">
                    Các phần thưởng của hộ {household} trong dịp {occasion} năm {year}
                </div>
            {:else}
                <span class="txt">Tất cả hộ khẩu</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Thêm trao quà</span>
            </button>
        </div>
    </div>
    <Table
        records={giftResidents}
        fields={[
            {
                name: "residentName",
                label: "Tên nhân khẩu",
            },
            {
                name: "num_gift",
                label: "Số quà nhận",
            },
            {
                name: "cost",
                label: "Chi phí",
            },
        ]}
        {isLoading}
        bind:bulkSelected={selectedRecords}
        on:select={(e) => giftSelectPanel?.show(e?.detail)}
    />
    <BulkBar
        bulkSelected={selectedRecords}
        actions={[{ label: "Xóa", onClick: deleteSelected, isDanger: true }]}
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
    on:create={(e) => console.log("🚀 create record with data", e.detail.number)}
    on:update={(e) => console.log("🚀 update record with data", e.detail)}
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
