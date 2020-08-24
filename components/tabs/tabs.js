Component({
  data: {},
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleItemTap(e) {
      // 获取点击的索引
      const { index } = e.currentTarget.dataset

      // 触发父组件的自定义事件
      this.triggerEvent("tabsItemChange", { index })
    }
  }
})