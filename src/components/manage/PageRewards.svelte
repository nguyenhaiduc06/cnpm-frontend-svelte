<script>
    import { querystring } from "svelte-spa-router";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionReward } from "../../utils/database/collections";
    import FormPanel from "@/components/base/FormPanel.svelte";
    import Table from "../base/Table.svelte";
    import { Api } from "@/services/api";

    $: reactiveParams = new URLSearchParams($querystring);
    $: rewardReportId = reactiveParams.get("reward-report-id") || "";
    let rewardReport;
    $: Api.getRewardReportById(rewardReportId).then((record) => (rewardReport = record));

    let addRewardFormPanel;

    let isLoading;
    let records;
    let bulkSelected;

    $: rewardReportId, load();

    async function load() {
        isLoading = true;
        records = await Api.getRewards({ filter: `reward_report = '${rewardReportId}'` });
        isLoading = false;
    }
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Khen thưởng</div>
            <div class="breadcrumb-item">{rewardReport?.name ?? ""}</div>
        </nav>
    </header>
    <div class="flex m-b-sm">
        <button type="button" class="btn btn-expanded" on:click={() => addRewardFormPanel?.show()}>
            <i class="ri-add-line" />
            <span class="txt">Thêm khen thưởng</span>
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
