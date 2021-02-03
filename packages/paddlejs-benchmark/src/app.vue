<template lang="pug">
    div
        config

</template>

<script lang="ts">
import Vue, { VNode } from "vue";
import config from "./config.vue";
export default Vue.extend({
    name: "App",
    data() {
        return {
            bundler: "Parcel",
        };
    },
    components: {
        'config': config
    },
    methods: {

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
