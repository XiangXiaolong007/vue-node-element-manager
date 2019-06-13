<template>
    <div class="index">
        <HeadNav></HeadNav>
        <div class="content">
            <LeftMenu />
            <div class="rightContainer">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import HeadNav from "../components/HeadNav"
import LeftMenu from "../components/LeftMenu"
export default {
    name: "index",
    components: {
        HeadNav,
        LeftMenu
    }
}
</script>
<style scoped>
.index {
    width: 100%;
    height: 100%;
}
.rightContainer {
    width: calc(100% - 180px);
    padding-left: 180px;
    min-height: 100%;
    height: 100%;
}
.content {
    padding-top: 71px;
    width: 100%;
    min-height: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
}
</style>
