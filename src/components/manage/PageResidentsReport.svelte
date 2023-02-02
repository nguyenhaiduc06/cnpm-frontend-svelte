<script>
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import ManageSidebar from "./ManageSidebar.svelte";
    import { CollectionResidentSnapshots } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import "chartjs-adapter-luxon";
    let genderChartCanvas;
    let ageChartCanvas;
    let chartInst;

    onMount(() => {
        const data = [
            { year: 2010, count: 10 },
            { year: 2011, count: 20 },
            { year: 2012, count: 15 },
            { year: 2013, count: 25 },
            { year: 2014, count: 22 },
            { year: 2015, count: 30 },
            { year: 2016, count: 28 },
        ];

        Chart.register(...registerables);

        new Chart(genderChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Nam", "Nữ"],
                datasets: [
                    {
                        label: "Giới tính",
                        data: [100, 200],
                        backgroundColor: ["#f87171", "#60a5fa"],
                        hoverOffset: 4,
                    },
                ],
            },
        });

        new Chart(ageChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Mầm non", "Cấp 1", "Lao động", "Nghỉ hưu"],
                datasets: [
                    {
                        label: "Giới tính",
                        data: [100, 200, 300, 200],
                        backgroundColor: ["#f87171", "#4ade80", "#60a5fa", "#c084fc"],
                    },
                ],
            },
        });
    });
</script>

<ManageSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Quản lý</div>
            <div class="breadcrumb-item">Thống kê nhân khẩu</div>
        </nav>
    </header>
    <div class="grid">
        <div class="col-lg-6 panel">
            <h1>Giới tính</h1>
            <canvas bind:this={genderChartCanvas} class="chart-canvas" style="height: 250px; width: 100%;" />
        </div>
        <div class="col-lg-6 panel">
            <h1>Độ tuổi</h1>
            <canvas bind:this={ageChartCanvas} class="chart-canvas" style="height: 250px; width: 100%;" />;
        </div>
    </div>
</PageWrapper>
