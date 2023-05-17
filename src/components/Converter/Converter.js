
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
        let paragraph = this.parseParagraph(lines[i])
        paragraph = this.parseInline(paragraph)

        if (paragraph) {
          output.push(paragraph)
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
    },
    parseParagraph (line) {
      line = line.trim()

      if (line.startsWith('----')) {
        return '<hr />'
      }
      else if (line.startsWith('# ')) {
        return `<p><strong>` + linkifyHtml(line, {
          target: "_blank",
        }) + `</strong></p>`
      }
      else if (line === '') {
        return '<p>&nbsp;</p>'
      }
      else {
        return `<p>` + linkifyHtml(line, {
          target: "_blank",
        }) + `</p>`
      }
    },
    parseInline (paragraph) {
      
      if (paragraph.split('**').length > 2) {
        let parts = paragraph.split('**')

        let output = []
        for (let i = 0; i < parts.length; i++) {
          let part = parts[i]
          if (i === 0) {
            output.push(part)
            continue
          }

          if (i % 2 === 1) {
            output.push(`<strong style="color:red">`)
          }
          else {
            output.push(`</strong>`)
          }
          output.push(part)
        }
        paragraph = output.join('')
      }

      return paragraph
    }
  }
}

export default app