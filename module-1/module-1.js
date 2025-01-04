


const main = async ()=>{

    //declarations !
    const number_of_questions = 5
    let current_question = 0;
    const question_bank = await((await fetch('question/module-1-question.json')).json())
    let answer_sheet = []
    
    const next_question_button = document.querySelector("[data-control-id='next-question-button']")
    const view_report_button = document.querySelector("[data-control-id='view-report-button']") 
    const view_report_section = document.querySelector("[data-control-id='main-display-section']")
    const main_menu_button = document.querySelector("[data-control-id='main-menu-button']")

    const timer_label = document.querySelector("[data-control-id='timer-label']")
    
    const max_time = 720 //seconds
    let elasped_time = 0
    let time_left = max_time
    let interval = 1000 //interval seconds

    //timer configuration
    let timerVariable = setInterval(()=>{
        elasped_time++
        time_left = max_time-elasped_time
        timer_label.textContent = "ETA :⌛ "+time_left

        if(time_left <= 0){
            //times up !
            next_question_button.disabled = true
            clearInterval(timerVariable)
        }

    },interval)

    //quiz loader/builder function
    function loadNextQuiz(quiz){
        let image_label = document.querySelector("[data-control-id='image-label']")
        let question_label = document.querySelector("[data-control-id='question-label']") 
        let answer_container = document.querySelector("[data-control-id='answer-container']")
    
        //reset all the data for display
        if(quiz.image_reference){
            image_label.style.background = `url(${quiz.image_reference})`
            image_label.style.backgroundSize = "cover"
        }
        else{
            image_label.style.background = "none"
            image_label.style.backgroundColor = "#ffb2b2"
        }
        question_label.textContent = quiz.question
        answer_container.innerHTML = ""
        
        for(let option of quiz.options){
            let option_element = document.createElement('input')
            let label_element = document.createElement('label')

            option_element.type = "radio"
            option_element.name = "option"
            option_element.value = option
            option_element.id=option

            label_element.htmlFor = option
            label_element.textContent = option

            answer_container.appendChild(option_element)
            answer_container.appendChild(label_element)
            answer_container.appendChild(document.createElement('br'))
        }
        
    }

    //result declaration function
    view_report_button.addEventListener('click',()=>{
        let total_correct = 0

        console.log(answer_sheet)
        
        for(let answer of answer_sheet){
            console.log(`${answer.selected_answer} , ${answer.correct_answer}`)
            if(answer.selected_answer == answer.correct_answer){
                total_correct++
            }
        }

        //disable the nextButton
        next_question_button.disabled=true

        let result = {}
        result.total_question = question_bank.length
        result.total_question_attempted = answer_sheet.length
        result.total_correct = total_correct
        result.answer_sheet = answer_sheet


        //prepare the result
        let report = document.createElement('div')
        report.setAttribute("class" , "report")
        
        let report_total_question_label = document.createElement('p')
        report_total_question_label.textContent = `Total Questions : ${result.total_question}`

        let report_total_question_unaswered_label = document.createElement('p')
        report_total_question_unaswered_label.textContent = `Total Questions Unanswered : ${result.total_question-result.total_question_attempted}`

        let report_total_correct_label = document.createElement('p')
        report_total_correct_label.textContent = `Total Correct : ${result.total_correct}`

        let report_summary_container = document.createElement('div')
        for(let answer of result.answer_sheet){
            let question_id_label = document.createElement('p')
            let question_label = document.createElement('p')
            let selected_answer_label = document.createElement('p')
            let correct_answer_label = document.createElement('p')

            question_id_label.textContent = `Question ID : ${answer.question_id}`
            question_label.textContent = `Question : ${answer.question}`
            selected_answer_label.textContent = `Selected Answer : ${answer.selected_answer}`
            correct_answer_label.textContent = `Correct Answer : ${answer.correct_answer}`

            report_summary_container.appendChild(question_id_label)
            report_summary_container.appendChild(question_label)
            report_summary_container.appendChild(selected_answer_label)
            report_summary_container.appendChild(correct_answer_label)
            report_summary_container.appendChild(document.createElement('hr'))
        }

        report.appendChild(report_total_question_label)
        report.appendChild(report_total_question_unaswered_label)
        report.appendChild(report_total_correct_label)
        report.appendChild(document.createElement('hr'))
        report.appendChild(report_summary_container)

        //upload the result
        view_report_section.innerHTML = report.outerHTML
        clearInterval(timerVariable)
    })


    //next question handler
    next_question_button.addEventListener('click',()=>{
        
        if(document.querySelector("input[type='radio']:checked")==null){
            alert("Please select an option")
            return
        }
        
        //grab the data
        let asked_question = document.querySelector("[data-control-id='question-label']").textContent
        let selected_answer = document.querySelector("input[type='radio']:checked").value
        let correct_answer = question_bank[current_question-1].correct_answer
        let question_id = question_bank[current_question-1].id

        answer_sheet.push({
            question_id: question_id,
            question: asked_question,
            selected_answer: selected_answer,
            correct_answer: correct_answer
        })
        

        //load the next Quiz 
        if(current_question < question_bank.length){
            loadNextQuiz(question_bank[current_question])
            current_question++;
        }
        else{
            next_question_button.disabled=true
            console.log("End of Quiz")
        }
    })

    //back to main menu
    main_menu_button.addEventListener('click',()=>{
        localStorage.clear()
        window.location.href = "/index.html"
    })

    


    //starter sequence
    localStorage.clear()
    loadNextQuiz(question_bank[current_question])
    current_question++;

}


main()