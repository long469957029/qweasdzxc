<template>
  <div :class="['js-bc-rules-toolbar tab-toolbar', type === 'normal' ? 'tab-pill tab-pill-deep' : '']" data-id="<%=obj.id %>" data-title="<%=obj.title %>">
    <div class="tab-title" v-if="title">{{title}}</div>
    <div :class="['tab-group',  !title ? 'no-margin' : '']">
      <span class="tab" v-for="rule in rules" :data-id="rule.id" :data-title="rule.title" :data-type="rule.type">
        <span class="tab-inner">{{rule.title}}</span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-rules",
    props: {
      type: String,
      id: Number,
      title: String,
      rules: Array,
    }
  }
</script>

<style scoped>

</style>
