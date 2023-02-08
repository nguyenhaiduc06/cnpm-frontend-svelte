<script>
    import { link } from "svelte-spa-router";
    import active from "svelte-spa-router/active";
</script>

<aside class="page-sidebar collection-sidebar">
    <div class="sidebar-content">
        <a
            href="/stats/residents"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/stats/residents", className: "active" }}
        >
            <span class="txt">Nhân khẩu</span>
        </a>
        <a
            href="/stats/resident-changes"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/stats/resident-changes", className: "active" }}
        >
            <span class="txt">Lịch sử thay đổi nhân khẩu</span>
        </a>
        <a
            href="/stats/rewards"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/stats/rewards", className: "active" }}
        >
            <span class="txt">Khen thưởng</span>
        </a>
        <a
            href="/stats/gifts"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/stats/gifts", className: "active" }}
        >
            <span class="txt">Trao quà</span>
        </a>
    </div>
</aside>
