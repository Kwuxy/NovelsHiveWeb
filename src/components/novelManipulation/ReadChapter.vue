<template>
  <div id="chapterReader">
    <h1 style="margin-bottom: 5%">
      {{storyTitle}}
      <div style="float: right;">
        <v-icon large v-if="author" @click="goToChapterEdit">edit</v-icon>
        <favorite-handler :story-id="storyId" :favorite-id="favoriteId" style="float: right;"></favorite-handler>
      </div>
    </h1>

    <chapter-navigation
      :previous-chapter-id="previousChapterId"
      :next-chapter-id="nextChapterId"
      style="margin-bottom: 13%;"
    ></chapter-navigation>

    <chapter-summary :chapters="storyChapters" v-if="showChapters"></chapter-summary>

    <div style="text-align: left;">
      <v-checkbox v-model="showChapters" label="Show chapter summary"></v-checkbox>

      <h2>{{chapterTitle}}</h2>
      <div v-html="chapterData"></div>
    </div>

    <chapter-navigation
      :previous-chapter-id="previousChapterId"
      :next-chapter-id="nextChapterId"
      style="margin-bottom: 7%;"
    ></chapter-navigation>
    <chapter-commentaries :chapter-id="chapterId"></chapter-commentaries>
  </div>
</template>

<script>
import ChapterNavigation from '../novelPresentation/ChapterNavigation'
import ChapterCommentaries from '../commentaries/ChapterCommentaries'
import FavoriteHandler from './FavoriteHandler'
import ChapterSummary from '../novelPresentation/chapterSummary'

export default {
  name: 'ReadChapter',
  components: {ChapterSummary, FavoriteHandler, ChapterNavigation, ChapterCommentaries},
  data () {
    return {
      storyTitle: '',
      storyId: 0,
      chapterTitle: '',
      chapterData: '',
      previousChapterId: null,
      nextChapterId: null,
      chapterId: 0,
      favoriteId: 0,
      storyChapters: [],
      showChapters: false,
      author: false
    }
  },
  created () {
    this.chapterId = this.$route.params.id.toString()
    this.loadData()
  },
  methods: {
    loadData () {
      this.$store.state.loader = true

      this.$http.get(process.env.API_LOCATION + '/chapters/' + this.chapterId + '/read', {
        headers: {
          'Authorization': localStorage.accessToken
        },
        params: {
          userId: localStorage.userId
        }
      }).then(response => this.getChapterSuccessful(response))
        .catch(error => this.getChapterFailed(error))
        .finally(() => {
          this.$store.state.loader = false
        })
    },
    getChapterSuccessful (response) {
      if (!response.data) {
        return this.getChapterFailed(null)
      }

      this.storyTitle = response.data.chapter.storyTitle
      this.chapterTitle = response.data.chapter.title
      this.chapterData = Buffer.from(response.data.chapter.text.data).toString('utf-8')
      this.previousChapterId = response.data.chapter.previousChapter.id
      this.nextChapterId = response.data.chapter.nextChapter.id
      this.favoriteId = response.data.chapter.favoriteId
      this.storyId = response.data.chapter.storyId
      this.storyChapters = response.data.chapter.storyChapters
      this.author = (response.data.chapter.author.toString() === localStorage.userId.toString())
    },
    getChapterFailed (error) {
      console.log(error)
    },
    gotoChapter (chapterId) {
      this.$router.push('/read/' + chapterId.toString())
    },
    goToChapterEdit () {
      this.$router.push('/write/' + this.chapterId.toString())
    }
  }
}
</script>

<style scoped>

</style>
