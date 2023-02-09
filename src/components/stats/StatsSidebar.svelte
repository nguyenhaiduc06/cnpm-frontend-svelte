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
    </div>
</aside>
