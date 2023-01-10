<script>
    import { replace } from "svelte-spa-router";
    import Searchbar from "@/components/base/Searchbar.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import RecordsList from "@/components/records/RecordsList.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionHouseholds } from "../../utils/database/collections";

    let householdsList;
    let filter;
    let sort;
    let householdUpsertPanel;
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Collections</div>
            <div class="breadcrumb-item">{CollectionHouseholds.name}</div>
        </nav>

        <div class="inline-flex gap-5">
            <RefreshButton on:refresh={() => householdsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => householdUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Hộ khẩu mới</span>
            </button>
        </div>
    </div>
    <Searchbar
        value={filter}
        autocompleteCollection={CollectionHouseholds}
        on:submit={(e) => (filter = e.detail)}
    />

    <RecordsList
        bind:this={householdsList}
        collection={CollectionHouseholds}
        bind:filter
        bind:sort
        on:select={(e) => replace("/manage/residents?householdId=" + e.detail.id)}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionHouseholds}
    on:save={() => householdsList?.reloadLoadedPages()}
    on:delete={() => householdsList?.reloadLoadedPages()}
/>
