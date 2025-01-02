console.log("Loaded")


const main = async function () {
    const question_container = document.getElementById('questions-section');
    const question_set_1 = await (await fetch('questions.json')).json();


    const quiz_time = 10 //seconds
    let time_elasped = 0;
    let intervalID;

    const timer = () => {
        let timerTag = document.getElementById("quiz-time")
        time_elasped += 1

        let time_left = quiz_time - time_elasped

        if(time_left <=0){
            clearInterval(intervalID)
            disableNextButton()
        }

        timerTag.textContent = time_left
    }

    intervalID = setInterval(timer, 1000)

    //this will be replaced with a function designed to select 20 random questions

    function loadQuiz(question) {

        //question of type radio to have their radio build here
        if (question['type'] === "radio") {

            //start building html elements
            let question_tag = document.createElement("p")
            question_tag.setAttribute("class", "question")
            question_tag.textContent = question['question']

            //set custom attribute having correct answer
            question_tag.setAttribute("data-custom-correct-answer", question["answer"])
            question_tag.setAttribute("data-id", "question");

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
                option_tag.setAttribute("data-id", "option")
                option_tag.setAttribute("class", "option")
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
            //default
            let questionSectionTag = document.getElementById("question-section")
            let answerSectionTag = document.getElementById("answer-section")
            let imageSectionTag = document.getElementById("quiz-graphic-section")

            //load the questions
            questionSectionTag.innerHTML = question_tag.outerHTML
            answerSectionTag.innerHTML = answer_tag.outerHTML
            imageSectionTag.innerHTML = image_tag.outerHTML

        }

        if (question['type'] === "number") {

            //start building html elements
            let question_tag = document.createElement("p")
            question_tag.setAttribute("class", "question")
            question_tag.textContent = question['question']

            //set custom attribute having correct answer
            question_tag.setAttribute("data-custom-correct-answer", question["answer"])
            question_tag.setAttribute("data-id", "question");

            //start building answer-section
            let answer_tag = document.createElement("div")
            answer_tag.setAttribute("name", "answer-section")
            answer_tag.setAttribute("class", "answer")

            let option_tag = document.createElement("input")

            option_tag.setAttribute("type", "number")
            option_tag.setAttribute("data-id", "text-option")
            option_tag.setAttribute("class", "option")


            answer_tag.appendChild(option_tag)

            //start building image tag
            let image_tag = document.createElement("img")
            image_tag.setAttribute("name", "image")
            question["image_reference"] ? image_tag.setAttribute("src", question["image_reference"]) : null


            //while building the final view reference check if image is present
            //default
            let questionSectionTag = document.getElementById("question-section")
            let answerSectionTag = document.getElementById("answer-section")
            let imageSectionTag = document.getElementById("quiz-graphic-section")

            //load the questions
            questionSectionTag.innerHTML = question_tag.outerHTML
            answerSectionTag.innerHTML = answer_tag.outerHTML
            imageSectionTag.innerHTML = image_tag.outerHTML

        }

    }

    function* provideQuiz() {
        for (let question of question_set_1) {
            yield question
        }
    }

    function disableNextButton() {
        let nextButtonTag = document.getElementById("quiz-next-button")
        nextButtonTag.disabled = true
    }

    const quizProvider = provideQuiz()
    let quiz = quizProvider.next()
    quiz.done == false ? loadQuiz(quiz.value) : disableNextButton()

    const nextButton = document.getElementById("quiz-next-button");

    nextButton.addEventListener("click", (event) => {

        //store the quiz
        let questionTag = document.querySelector("[data-id='question']")

        let question = questionTag.textContent
        let correctAnswer = questionTag.getAttribute("data-custom-correct-answer")

        let answer = (document.querySelector('[data-id="option"]:checked') || document.querySelector('[data-id="text-option"]'))


        //check the user input
        if (answer == null || answer.value == null || answer.value.length == 0) {
            alert("Please select an answer")
            return
        }

        console.log(`${question}\n${answer.value}\n${correctAnswer}`)

        //get the next quiz
        let quiz = quizProvider.next()

        //check if the quiz is done
        if (quiz.done === true) {
            //disable !
            disableNextButton()
        }

        else {
            //if not run !!
            loadQuiz(quiz.value)
        }
    })



}

main()

