<script>
    import { replace } from "svelte-spa-router";
    import Searchbar from "@/components/base/Searchbar.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import RecordsList from "@/components/records/RecordsList.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionHouseholds } from "../../utils/database/collections";
    import { CollectionRewardReport } from "../../utils/database/collections";

    let filter;
    let reportList;
    let sort;
    let householdUpsertPanel;
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Collections</div>
            <div class="breadcrumb-item">Reward Reports</div>
        </nav>

        <div class="inline-flex gap-5">
            <RefreshButton on:refresh={() => reportList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => householdUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Thêm dịp khen thưởng</span>
            </button>
        </div>
    </div>
    <Searchbar
        value={filter}
        autocompleteCollection={CollectionHouseholds}
        on:submit={(e) => (filter = e.detail)}
    />

    <RecordsList
        bind:this={reportList}
        collection={CollectionRewardReport}
        bind:filter
        bind:sort
        on:select={(e) => replace("/manage/reward?rewardreport=" + e.detail.id + "&year=" + e.detail.name)}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionRewardReport}
    on:save={() => reportList?.reloadLoadedPages()}
    on:delete={() => reportList?.reloadLoadedPages()}
/>
