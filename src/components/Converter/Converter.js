
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
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1).trim()
      }
      if (content.startsWith("'") && content.endsWith("'")) {
        content = content.slice(1, -1).trim()
      }

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
    escapeHTML(html) {
      return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    parseParagraph (line) {
      line = line.trim()
      line = this.escapeHTML(line)

      if (line.startsWith('----')) {
        return '<hr />'
      }
      else if (line === '[加油]') {
        return `<br /><p style="text-align: center; font-size: 3rem;">\\ 加油 /<br /></p>
        <p style="text-align: center;"><img src="https://blogger.googleusercontent.com/img/a/AVvXsEjF68RhCHmEdS6xVm_EwsR8Wh-CXVUOdLE5u7sgP-MkVi5dnTcZZG0Uzku1r5WosD8ODY0cqIyddUtQGVtEXALAvgpUA1ftIJ9LQ3lv6tgpjQwBTX41TwLFvbH80Qz8td8ekcsvLJvmveS6EPazfIsvUQcIfqW7FhXe_T8pMIrPwoEmnzkO6YTP1A">
            <br>
        </p>
        `
      }
      else if (line.startsWith('# ')) {
        return `<p><strong>` + linkifyHtml(line, {
          target: "_blank",
        }) + `</strong></p>`
      }
      else if (line === '') {
        return '<p>&nbsp;</p>'
      }
      else if (line.startsWith('https://blogger.googleusercontent.com/img/a/')) {
        return `<p><a href="${line}" target="_blank"><img src="${line}" style="border:1px solid #ccc;max-width: calc(100% - 1rem); height: auto" /></a></p>`
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