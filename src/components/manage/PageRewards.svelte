<script>
    import { querystring, replace } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionReward } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";
    import { Record } from "pocketbase";
    import { link } from "svelte-spa-router";

    $: reactiveParams = new URLSearchParams($querystring);

    $: rewardReportId = reactiveParams.get("reward-report-id");
    let rewardReport;
    $: if (rewardReportId) {
        Api.getRewardReportById(rewardReportId).then((record) => (rewardReport = record));
    } else {
        rewardReport = undefined;
    }

    $: householdId = reactiveParams.get("household-id");
    let household;
    $: if (householdId) {
        Api.getHouseholdById(householdId).then((record) => (household = record));
    } else {
        household = undefined;
    }

    let addRewardFormPanel;
    let filterByHouseholdFormPanel;

    let isLoading;
    let records = [];
    let bulkSelected;

    $: totalRewardAmount = records.reduce((prev, cur) => {
        return prev + cur?.amount ?? 0;
    }, 0);

    $: rewardReportId, householdId, load();

    async function load() {
        isLoading = true;
        records = await Api.getRewards({
            filter: `reward_report ~ '${rewardReportId ?? ""}' && household ~ "${householdId ?? ""}"`,
        });
        isLoading = false;
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">
                <a href="/manage/reward-reports" use:link>
                    <span>Khen thưởng</span>
                </a>
            </div>
            <div class="breadcrumb-item">
                <a href={`/manage/rewards?reward-report-id=${rewardReport?.id}`} use:link>
                    <span>{rewardReport?.name ?? ""}</span>
                </a>
            </div>
            {#if household}
                <div class="breadcrumb-item">Hộ khẩu số {household?.number ?? ""}</div>
            {/if}
        </nav>
    </header>

    <div class="m-b-sm">
        <h1>Tổng số lượng phần thưởng: {totalRewardAmount}</h1>
    </div>

    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addRewardFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm khen thưởng</span>
        </button>
        <div class="flex-fill" />
        <button
            type="button"
            class="btn btn-outline"
            on:click={() =>
                filterByHouseholdFormPanel?.show(
                    household ? new Record({ household: household.id }) : undefined
                )}
        >
            <i class="ri-filter-line" />
            <span class="txt">Lọc theo hộ khẩu</span>
        </button>
    </div>

    <Table
        {isLoading}
        {records}
        bind:bulkSelected
        fields={[
            {
                name: "name",
                label: "Họ và tên",
            },
            {
                name: "address",
                label: "Địa chỉ",
            },
            {
                name: "school",
                label: "Trường",
            },
            {
                name: "grade",
                label: "Khối",
            },
            {
                name: "education_result",
                label: "Kết quả học tập",
            },
            {
                name: "education_proof",
                label: "Minh chứng",
            },
            {
                name: "amount",
                label: "Số lượng",
            },
        ]}
    />
</PageWrapper>

<FormPanel
    bind:this={addRewardFormPanel}
    title="Thêm khen thưởng"
    fields={CollectionReward.schema.filter((field) => !["household", "reward_report"].includes(field.name))}
    on:submit={(e) => {
        const rewardData = e.detail;
        rewardData.set("reward_report", rewardReport.id);
        Api.createReward(rewardData).then(load);
    }}
/>

<FormPanel
    bind:this={filterByHouseholdFormPanel}
    title="Chọn hộ khẩu"
    fields={CollectionReward.schema.filter((field) => ["household"].includes(field.name))}
    on:submit={(e) => {
        replace(
            `/manage/rewards?reward-report-id=${rewardReport?.id}&household-id=${e.detail.get("household")}`
        );
    }}
/>
