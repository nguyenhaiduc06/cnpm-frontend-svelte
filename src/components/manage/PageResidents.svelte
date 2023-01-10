<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import RecordUpsertPanel from "@/components/base/RecordUpsertPanel.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import ResidentsList from "./ResidentsList.svelte";
    import { CollectionHouseholds, CollectionResidentSnapshots } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";

    $: reactiveParams = new URLSearchParams($querystring);
    $: householdId = reactiveParams.get("householdId") || "";

    let residentUpsertPanel;
    let residentsList;
    let householdUpsertPanel;
    let householdSelectPanel;
    let filter;
    let sort;

    $: filter = householdId ? `household ="${householdId}"` : "";
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
            {#if householdId}
                <div class="breadcrumb-item">Hộ khẩu {householdId}</div>
            {:else}
                <span class="txt">Tất cả hộ khẩu</span>
            {/if}
        </button>
        <div class="flex-fill" />
        <div class="btns-group">
            <button type="button" class="btn btn-expanded" on:click={() => residentUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">Đăng kí thường trú</span>
            </button>
        </div>
    </div>

    <ResidentsList
        bind:this={residentsList}
        bind:filter
        bind:sort
        on:select={(e) => residentUpsertPanel?.show(e?.detail)}
        on:splitHousehold={(e) => householdUpsertPanel?.show()}
        on:changeHousehold={(e) => householdSelectPanel?.show()}
    />
</PageWrapper>

<RecordUpsertPanel
    bind:this={residentUpsertPanel}
    collection={CollectionResidentSnapshots}
    on:save={() => residentsList?.reloadLoadedPages()}
    on:delete={() => residentsList?.reloadLoadedPages()}
/>

<RecordUpsertPanel
    bind:this={householdUpsertPanel}
    collection={CollectionHouseholds}
    on:save={() => residentsList?.reloadLoadedPages()}
    on:delete={() => residentsList?.reloadLoadedPages()}
    on:create={(e) => console.log("🚀 create record with data", e.detail.number)}
    on:update={(e) => console.log("🚀 update record with data", e.detail)}
/>

<FormPanel
    bind:this={householdSelectPanel}
    on:submit={(e) => console.log('FormPanel submitted with data', e.detail)}
    fields={CollectionResidentSnapshots.schema.filter((field) => field.name == "household")}
/>
