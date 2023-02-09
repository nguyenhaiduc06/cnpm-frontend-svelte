<script>
    import { link } from "svelte-spa-router";
    import active from "svelte-spa-router/active";
</script>

<aside class="page-sidebar collection-sidebar">
    <div class="sidebar-content">
        <a
            href="/manage/households"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/households", className: "active" }}
        >
            <span class="txt">Hộ khẩu</span>
        </a>
        <a
            href="/manage/permanent"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/permanent.*", className: "active" }}
        >
            <span class="txt">Thường trú</span>
        </a>
        <a
            href="/manage/absent"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/absent.*", className: "active" }}
        >
            <span class="txt">Tạm vắng</span>
        </a>
        <a
            href="/manage/temporary"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/temporary.*", className: "active" }}
        >
            <span class="txt">Tạm trú</span>
        </a>
        <a
            href="/manage/rewards/reward-reports"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/rewards.*", className: "active" }}
        >
            <span class="txt">Khen thưởng</span>
        </a>
        <a
            href="/manage/gifts/gift-reports"
            class="sidebar-list-item"
            use:link
            use:active={{ path: "/manage/gifts.*", className: "active" }}
        >
            <span class="txt">Trao quà</span>
        </a>
    </div>
</aside>
