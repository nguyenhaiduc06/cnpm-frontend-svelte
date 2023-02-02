<script>
    import { replace, push } from "svelte-spa-router";
    import Searchbar from "@/components/base/Searchbar.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import RecordsList from "@/components/records/RecordsList.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionGiftReport } from "../../utils/database/collections";
    import GiftList from "./HouseholdGiftList.svelte";
    import GiftReportSearchBar from "../base/GiftReportSearchBar.svelte";

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
            <div class="breadcrumb-item">Gift Reports</div>
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
                <span class="txt">Thêm dịp trao quà</span>
            </button>
        </div>
    </div>
    <GiftReportSearchBar
        autocompleteCollection={CollectionGiftReport}
        searchField = "occasion"
        on:submit={(e) => (filter = e.detail)}
    />

    <RecordsList
        bind:this={reportList}
        collection={CollectionGiftReport}
        bind:filter
        bind:sort
        on:select={(e) =>
            push(
                `/manage/gift?giftreport=${e.detail.id}&occasion=${e.detail.occasion}&year=${e.detail.year}`
            )}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionGiftReport}
    on:save={() => reportList?.reloadLoadedPages()}
    on:delete={() => reportList?.reloadLoadedPages()}
/>
