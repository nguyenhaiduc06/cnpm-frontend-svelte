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

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("giftreport") || "";
    $: year = reactiveParams.get("year") || "";
    $: occasion = reactiveParams.get("occasion") || "";
    let residentUpsertPanel;
    let residentsList;
    let rewardUpsertPanel;
    let rewardSelectPanel;
    let filter;
    let sort;
    let rewardList;
    let records = [];
    let selectedHouseholds = [];
    let isLoading;

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
                <div class="breadcrumb-item">Các phần thưởng trong dịp {occasion} năm {year}</div>
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
        {records}
        fields={[
            {
                name: "id",
                label: "STT",
            },
            {
                name: "household",
                label: "Hộ gia đình",
            },
            {
                name: "gift_received",
                label: "Số thành viên nhận quà",
            },
            {
                name: "total_cost",
                label: "Tổng chi phí",
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
        actions={[{ label: "Xóa", onClick: deleteSelectedHouseholds, isDanger: true }]}
    />
</PageWrapper>

<GiftUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionGift}
    excludedFields={["gift_report"]}
    excludedVal={[reportId]}
    on:save={() => load()}
    on:delete={() => load()}
    on:create={(e) => console.log("🚀 create record with data", e.detail.number)}
    on:update={(e) => console.log("🚀 update record with data", e.detail)}
/>

<FormPanel
    bind:this={rewardSelectPanel}
    on:submit={(e) => console.log("FormPanel submitted with data", e.detail)}
    fields={CollectionGift.schema.filter((field) => field.name == "resident")}
/>
