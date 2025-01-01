
let globalCounter = 0


const main = async function () {
    const question_container = document.getElementById('questions-section');
    const question_set_1 = await (await fetch('questions.json')).json();


    //this will be replaced with a function designed to select 20 random questions

    function buildQuiz() {

        const question_set = []
        for (let question of question_set_1) {
            //question of type radio to have their radio build here
            if (question['type'] === "radio") {

                //start building html elements
                let question_tag = document.createElement("p")
                question_tag.setAttribute("class", "question")
                question_tag.textContent = question['question']

                //start building answer-section
                let answer_tag = document.createElement("div")
                answer_tag.setAttribute("name", "answer-section")
                answer_tag.setAttribute("class", "answer")

                for (let option of question["options"]) {
                    let option_tag = document.createElement("input")
                    let label_tag = document.createElement("label")

                    option_tag.setAttribute("type", "radio")
                    option_tag.setAttribute("name", `${question["question_id"]}-radiogroup`)
                    option_tag.setAttribute("id", option)
                    option_tag.value = option

                    label_tag.htmlFor = option
                    label_tag.textContent = option

                    answer_tag.appendChild(option_tag)
                    answer_tag.appendChild(label_tag)
                    answer_tag.appendChild(document.createElement("br"))
                }

                //start building image tag
                let image_tag = document.createElement("img")
                image_tag.setAttribute("name", "image")
                question["image_reference"] ? image_tag.setAttribute("src", question["image_reference"]) : null


                //while building the final view reference check if image is present

                const question_set_object = {}
                question_set_object.question = question_tag;
                question_set_object.answer = answer_tag;
                question_set_object.image_reference = image_tag.getAttribute("src") ? image_tag : null
                question_set_object.type = "radio"
                question_set_object.activeQuestionReference = question


                question_set.push(question_set_object)
            }

            //if type is input
            else if (question['type'] === "text") {

                //start building html elements
                let question_tag = document.createElement("p")
                question_tag.setAttribute("class", "question")
                question_tag.textContent = question['question']

                //start building answer-section
                let answer_tag = document.createElement("div")
                answer_tag.setAttribute("name", "answer-section")
                answer_tag.setAttribute("class", "answer")

                let input_tag = document.createElement("input")
                input_tag.setAttribute("type", "text")
                input_tag.setAttribute("name", `${question["question_id"]}-textbox`)

                answer_tag.appendChild(input_tag)

                //start building image tag
                let image_tag = document.createElement("img")
                image_tag.setAttribute("name", "image")
                question["image_reference"] ? image_tag.setAttribute("src", question["image_reference"]) : null


                //while building the final view reference check if image is present

                const question_set_object = {}
                question_set_object.question = question_tag;
                question_set_object.answer = answer_tag;
                question_set_object.image_reference = image_tag.getAttribute("src") ? image_tag : null
                question_set_object.type = "text"
                question_set_object.activeQuestionReference = question


                question_set.push(question_set_object)
            }

        }

        return question_set
    }

    const questionElements = buildQuiz()

    function loadQuiz(currentQuestion) {
        let questionSectionTag = document.getElementById("question-section")
        let answerSectionTag = document.getElementById("answer-section")

        //load the questions
        questionSectionTag.innerHTML = currentQuestion["question"].outerHTML
        answerSectionTag.innerHTML = currentQuestion["answer"].outerHTML

    }

    loadQuiz(questionElements[globalCounter])

    const nextButton = document.getElementById("next-question-button");

    nextButton.addEventListener("click", (event) => {


        //fetch what the user has selected !
        if (questionElements[globalCounter].type === "radio") {
            const activeQuestion = questionElements[globalCounter]
            let selectedAnswer = document.querySelector(`input[name="${activeQuestion.activeQuestionReference["question_id"]}-radiogroup"]:checked`)

            console.log(selectedAnswer)
            if(selectedAnswer==null){
                alert("Please select a option")
                return
            }

            loadQuiz(questionElements[globalCounter])
            globalCounter++
        }

        else if (questionElements[globalCounter].type === "text") {
            const activeQuestion = questionElements[globalCounter]
            let selectedAnswer = document.querySelector(`input[name="${activeQuestion.activeQuestionReference["question_id"]}-textbox"]`)

            console.log(selectedAnswer.value)
            if(selectedAnswer==null){
                alert("Please select a option")
                return
            }

            loadQuiz(questionElements[globalCounter])
            globalCounter++
        }


        //else continue
        //check if the quiz is over !
        globalCounter = globalCounter >= questionElements.length ? 0 : globalCounter
        loadQuiz(questionElements[globalCounter])

    })



}

main()

