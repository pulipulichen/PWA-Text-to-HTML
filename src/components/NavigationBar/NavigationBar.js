let app = {
  props: ['db'],
  components: {
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {
  },
  mounted() {
    
  },
  methods: {
    copy () {
      this.$parent.$refs.Converter.copy()
    }
  }
}
 
export default app