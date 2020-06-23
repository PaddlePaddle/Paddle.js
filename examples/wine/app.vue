<template lang="pug">
    div
        page

</template>

<script lang="ts">
import Vue from "vue";
import page from "./page.vue";
export default Vue.extend({
    data() {
        return {
            bundler: "Parcel",
        };
    },
    components: {
        'page': page
    }
});
</script>

<style lang="less" scoped>
.container {
    color: green;
}
.text {
    color: red;
}
</style>
