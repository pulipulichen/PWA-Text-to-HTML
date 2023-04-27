
import linkifyHtml from 'linkify-html';

let app = {
  props: ['db'],
  components: {
    // DataTaskManager: () => import(/* webpackChunkName: "components/DataTaskManager" */ './DataTaskManager/DataTaskManager.vue')
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
    contentHTML () {
      let content = this.db.localConfig.content
      content = content.trim()

      // content = `<p>` + content + `</p>`
      let lines = content.split('\n')
      let output = []

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()

        if (line.startsWith('----')) {
          output.push('<hr />')
          continue
        }
        else if (line.startsWith('# ')) {
          output.push(`<p><strong>` + linkifyHtml(line, {
            target: "_blank",
          }) + `</strong></p>`)
          continue
        }
        else if (line === '') {
          output.push('<p>&nbsp;</p>')
          continue
        }
        else {
          output.push(`<p>` + linkifyHtml(line, {
            target: "_blank",
          }) + `</p>`)
          continue
        }

      }

      return output.join('\n')
    }
  },
  mounted() {
    
  },
  methods: {
    copy () {
      this.db.utils.ClipboardUtils.copyRichText(this.contentHTML)
    }
  }
}

export default app