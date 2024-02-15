import CategoryRepo from "../persistence/category_repo"
import QuestionRepo from "../persistence/question_repo"
import { shuffle } from "./array_methods"
export default class StudySession {
  constructor({categoryIds, questionsNumber, dificultyLevel, knowledge}) {
    this.categoryIds = categoryIds
    this.questionsNumber = questionsNumber
    this.dificultyLevel = dificultyLevel
    this.knowledge = knowledge
    this.questionRepo = QuestionRepo()
    this.partitionsCount = Math.ceil(questionsNumber / categoryIds.length)
    this.data = {}
    this.results = []
  }

  async create() {
    await this.fetchCategories()
    await this.fetchAndShuffle()
    this.filter()
    this.transform()
    this.shuffleResults()
    this.save()
  }

  async fetchCategories() {
    this.categories = await CategoryRepo().all()
  }

  async fetchAndShuffle() {
    for (const id of this.categoryIds) {
      let currentData = shuffle(await this.questionRepo.byCategory(id))
      if (this.dificultyLevel) {
        currentData = currentData.filter(q => q.dificulty_level === this.dificultyLevel)
      }
      console.log(`HEY: ${this.knowledge}`)
      if (this.knowledge !== null) {
        currentData = currentData.filter(q => q.answer_known === this.knowledge)
      }
      this.data[id] = currentData
    }
  }

  filter() {
    for (const id of this.categoryIds) {
      this.data[id] = this.data[id].slice(0, this.partitionsCount)
    }
  }

  transform() {
    for (const id in this.data) {
      const category = this.categories.find(c => c.id.toString() === id)
      this.results = [ ...this.results, ...this.data[id].map(q => ({ ...q, category })) ]
    }
  }

  shuffleResults() {
    this.results = shuffle(this.results)
  }

  save() {
    this.questionRepo.insertSessionData(this.results)
  }
}