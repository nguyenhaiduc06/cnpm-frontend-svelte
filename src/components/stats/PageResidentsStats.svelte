<script>
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import RefreshButton from "@/components/base/RefreshButton.svelte";
    import StatsSidebar from "./StatsSidebar.svelte";
    import { CollectionResidentSnapshots } from "../../utils/database/collections";
    import Table from "../base/Table.svelte";
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import "chartjs-adapter-luxon";
    import { Api } from "@/services/api";
    import ResidentSnapshotsByTime from "./ResidentSnapshotsByTime.svelte";
    let genderChartCanvas;
    let ageChartCanvas;
    let chartInst;
    let ageDataSet = [0, 0, 0, 0];
    let genderDataSet = [0, 0];

    onMount(async () => {
        const residents = await Api.getResidents();

        for (const record of residents) {
            const { resident } = record.expand;
            const { birthday, gender } = resident ?? {};

            const age = new Date(Date.now()).getFullYear() - new Date(birthday).getFullYear();
            if (0 <= age && age <= 5) {
                ageDataSet[0]++;
            }
            if (6 <= age && age <= 18) {
                ageDataSet[1]++;
            }
            if (19 <= age && age <= 45) {
                ageDataSet[2]++;
            }
            if (46 <= age) {
                ageDataSet[3]++;
            }

            if (gender == "nam") {
                genderDataSet[0]++;
            } else if (gender == "nữ") {
                genderDataSet[1]++;
            }
        }

        Chart.register(...registerables);

        new Chart(genderChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Nam", "Nữ"],
                datasets: [
                    {
                        label: "Giới tính",
                        data: genderDataSet,
                        backgroundColor: ["#f87171", "#60a5fa"],
                        hoverOffset: 4,
                    },
                ],
            },
        });

        new Chart(ageChartCanvas, {
            type: "doughnut",
            data: {
                // labels: ["Mầm non", "Cấp 1", "Lao động", "Nghỉ hưu"],
                labels: ["1-5 tuổi", "6-18 tuổi", "19-45 tuổi", "trên 45 tuổi"],
                datasets: [
                    {
                        label: "Giới tính",
                        data: ageDataSet,
                        backgroundColor: ["#f87171", "#4ade80", "#60a5fa", "#c084fc"],
                    },
                ],
            },
        });
    });
</script>

<StatsSidebar />

<PageWrapper>
    <header class="page-header">
        <nav class="breadcrumbs">
            <div class="breadcrumb-item">Thống kê</div>
            <div class="breadcrumb-item">Nhân khẩu</div>
        </nav>
    </header>
    <div class="grid">
        <div class="col-lg-4 panel">
            <h1>Giới tính</h1>
            <canvas bind:this={genderChartCanvas} class="chart-canvas" style="height: 250px; width: 100%;" />
        </div>
        <div class="col-lg-4 panel">
            <h1>Độ tuổi</h1>
            <canvas bind:this={ageChartCanvas} class="chart-canvas" style="height: 250px; width: 100%;" />;
        </div>
        <div class="col-lg-4 panel">
            <h1>Tạm trú / Tạm vắng</h1>
        </div>
        <div class="col-lg-12 panel">
            <h1>Nhân khẩu theo thời gian</h1>
            <ResidentSnapshotsByTime />
        </div>
    </div>
</PageWrapper>
