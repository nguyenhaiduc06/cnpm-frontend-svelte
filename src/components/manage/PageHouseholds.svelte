<script>
    import { push, replace } from "svelte-spa-router";
    import Searchbar from "@/components/base/Searchbar.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionHouseholds } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import FormPanel from "../base/FormPanel.svelte";
    import { getHouseholds } from "@/services/api";

    let householdsList;
    let householdUpsertPanel;
    let households;

    getHouseholds().then((result) => (households = result));
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
        <button type="button" class="btn btn-expanded" on:click={() => householdUpsertPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Nhập sổ hộ khẩu</span>
        </button>
        <div class="flex-fill" />
        <button type="button" class="btn btn-outline" on:click={() => {}}>
            <i class="ri-filter-line" />
            <span class="txt">Lọc</span>
        </button>
    </div>

    <Table
        records={households}
        fields={CollectionHouseholds.schema.filter((s) => ["number", "address"].includes(s.name))}
        isLoading={false}
        on:select={(e) => householdUpsertPanel?.show(e.detail)}
    />
</PageWrapper>

<FormPanel
    bind:this={householdUpsertPanel}
    title="Thêm hộ khẩu mới"
    fields={CollectionHouseholds.schema.filter((s) => ["number", "address"].includes(s.name))}
    on:submit={(e) => console.log(e.detail)}
/>

<!-- <RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionHouseholds}
    on:save={() => householdsList?.reloadLoadedPages()}
    on:delete={() => householdsList?.reloadLoadedPages()}
/> -->
