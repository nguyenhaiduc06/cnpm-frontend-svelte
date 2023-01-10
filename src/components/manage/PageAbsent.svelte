<script>
    import { CollectionAbsentResidents } from "@/utils/database/collections";
    import PageWrapper from "../base/PageWrapper.svelte";
    import RecordsList from "../records/RecordsList.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import RefreshButton from "../base/RefreshButton.svelte";
    import RecordUpsertPanel from "../records/RecordUpsertPanel.svelte";

    const collection = CollectionAbsentResidents;
    let recordsList;
    let recordUpsertPanel;
</script>

<ManageSidebar />
<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Tạm vắng</div>
        </nav>

        <div class="inline-flex">
            <RefreshButton on:refresh={() => recordsList?.load()} />
        </div>
    </header>
    <div class="flex m-b-sm">
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => recordUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Đăng kí tạm vắng</span>
            </button>
        </div>
    </div>
    <RecordsList bind:this={recordsList} {collection} on:select={(e) => recordUpsertPanel?.show(e.detail)} />
</PageWrapper>

<RecordUpsertPanel
    bind:this={recordUpsertPanel}
    {collection}
    on:save={() => recordsList?.reloadLoadedPages()}
    on:delete={() => recordsList?.reloadLoadedPages()}
/>
