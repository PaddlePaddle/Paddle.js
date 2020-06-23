<template lang="pug">
    div
        config

</template>

<script lang="ts">
import Vue from "vue";
import config from "./config.vue";
export default Vue.extend({
    data() {
        return {
            bundler: "Parcel",
        };
    },
    components: {
        'config': config
    },
    methods() {

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
