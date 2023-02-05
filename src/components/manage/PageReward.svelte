<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionReward, CollectionResidentSnapshots } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import RewardList from "./RewardList.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: reportId = reactiveParams.get("rewardreport") || "";
    $: year = reactiveParams.get("year") || "";
    let residentUpsertPanel;
    let residentsList;
    let rewardUpsertPanel;
    let rewardSelectPanel;
    let filter;
    let sort;
    let rewardList;

    $: filter = reportId ? `reward_report ="${reportId}"` : "";
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Nhân khẩu</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => residentsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            {#if reportId}
                <div class="breadcrumb-item">Các phần thưởng trong năm {year}</div>
            {:else}
                <span class="txt">Tất cả hộ khẩu</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Thêm khen thưởng</span>
            </button>
        </div>
    </div>

    <RewardList
        bind:this={rewardList}
        collection={CollectionReward}
        bind:filter
        bind:sort
        on:select={(e) => residentUpsertPanel?.show(e?.detail)}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionReward}
    excludedFields={["reward_report"]}
    excludedVal={[reportId]}
    on:save={() => rewardList?.reloadLoadedPages()}
    on:delete={() => rewardList?.reloadLoadedPages()}
    on:create={(e) => console.log("🚀 create record with data", e.detail.number)}
    on:update={(e) => console.log("🚀 update record with data", e.detail)}
/>

<FormPanel
    bind:this={rewardSelectPanel}
    on:submit={(e) => console.log("FormPanel submitted with data", e.detail)}
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
/>
