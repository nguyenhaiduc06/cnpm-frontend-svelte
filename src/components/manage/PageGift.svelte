<script>
    import { querystring } from "svelte-spa-router";
    import { replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import ResidentsList from "./ResidentsList.svelte";
    import { CollectionGift } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import RewardList from "./RewardList.svelte";
    import RecordsList from "../records/RecordsList.svelte";
    import GiftList from "./HouseholdGiftList.svelte";
    import GiftUpsertPanel from "./GiftUpsertPanel.svelte";

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

    $: filter = reportId ? `gift_report ="${reportId}"` : "";
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

    <RecordsList
        bind:this={rewardList}
        collection={CollectionGift}
        bind:filter
        bind:sort
        on:select={(e) => residentUpsertPanel?.show(e?.detail)}
    />
</PageWrapper>


<GiftUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionGift}
    excludedFields={["gift_report"]}
    excludedVal={[reportId]}
    on:save={() => rewardList?.reloadLoadedPages()}
    on:delete={() => rewardList?.reloadLoadedPages()}
    on:create={(e) => console.log("🚀 create record with data", e.detail.number)}
    on:update={(e) => console.log("🚀 update record with data", e.detail)}
/>

<FormPanel
    bind:this={rewardSelectPanel}
    on:submit={(e) => console.log("FormPanel submitted with data", e.detail)}
    fields={CollectionGift.schema.filter((field) => field.name == "resident")}
/>
