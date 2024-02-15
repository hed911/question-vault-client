import CategoryRepo from "../persistence/category_repo"
import QuestionRepo from "../persistence/question_repo"

export default DataSyncer = () => {
  const start = async () => {
    //try {
      const categoryRepo = CategoryRepo()
      const categoriesData = await fetchCategories()
      categoryRepo.updateBulk(categoriesData)

      const questionRepo = QuestionRepo()
      const questionsData = {}
      for (const category of categoriesData) {
        questionsData[category.id] = await fetchQuestions(category.id)
      }
      questionRepo.updateBulk(questionsData)
      questionRepo.insertSessionData([])
    //} catch (e) {
    //  console.log(e.message)
    //}
  }

  const fetchCategories = async () => {
    const response = await fetch('https://question-vault.onrender.com/api/v1/question_groups')
    return await response.json()
  }

  const fetchQuestions = async categoryId => {
    const response = await fetch(`https://question-vault.onrender.com/api/v1/question_groups/${categoryId}/questions`)
    return await response.json()
  }

  const updateDificulty = async (questionId, dificultyLevel) => {
    const response = await fetch(`https://question-vault.onrender.com/api/v1/questions/${questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dificultyLevel })
    })
    return await response.json()
  }

  const updateKnowledgeState = async (questionId, answerKnown) => {
    const response = await fetch(`https://question-vault.onrender.com/api/v1/questions/${questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answerKnown })
    })
    return await response.json()
  }

  return { start, updateDificulty, updateKnowledgeState }
}