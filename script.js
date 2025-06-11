document.addEventListener('DOMContentLoaded', () => {
    const questionsList = document.getElementById('questionsList');
    const addQuestionBtn = document.getElementById('addQuestion');
    const addShortAnswerBtn = document.getElementById('addShortAnswer');
    const generatePDFBtn = document.getElementById('generatePDF');
    const questionTemplate = document.getElementById('questionTemplate');
    const examFieldsList = document.getElementById('examFieldsList');
    const addFieldBtn = document.getElementById('addField');
    const fieldTemplate = document.getElementById('fieldTemplate');

    // Add new question
    addQuestionBtn.addEventListener('click', () => {
        const questionCard = questionTemplate.content.cloneNode(true);
        questionsList.appendChild(questionCard);
        
        // Add layout toggle functionality
        const layoutToggle = questionsList.lastElementChild.querySelector('.options-layout');
        const singleLineIcon = questionsList.lastElementChild.querySelector('.single-line-icon');
        const multiLineIcon = questionsList.lastElementChild.querySelector('.multi-line-icon');
        const layoutText = questionsList.lastElementChild.querySelector('.layout-text');
        
        layoutToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                singleLineIcon.style.display = 'none';
                multiLineIcon.style.display = 'inline';
                layoutText.textContent = 'Multiple Lines';
            } else {
                singleLineIcon.style.display = 'inline';
                multiLineIcon.style.display = 'none';
                layoutText.textContent = 'Single Line';
            }
        });
        
        // Add remove functionality
        const removeButton = questionsList.lastElementChild.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => {
            questionsList.lastElementChild.remove();
        });
    });

    // Remove question
    questionsList.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove')) {
            e.target.closest('.question-card').remove();
        }
    });

    // Add new field
    addFieldBtn.addEventListener('click', () => {
        const fieldRow = fieldTemplate.content.cloneNode(true);
        const fieldNameInput = fieldRow.querySelector('.field-name');
        const fieldValueInput = fieldRow.querySelector('.field-value');

        // Focus on field name input
        examFieldsList.appendChild(fieldRow);
        fieldNameInput.focus();

        // When field name is entered, focus on value input
        fieldNameInput.addEventListener('change', () => {
            if (fieldNameInput.value.trim()) {
                fieldValueInput.focus();
            }
        });
    });

    // Remove field
    examFieldsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-field')) {
            const fieldRow = e.target.closest('.field-row');
            // Don't allow removing the Exam Name field
            if (!fieldRow.querySelector('#examName')) {
                fieldRow.remove();
            }
        }
    });

    // Add Short Answer Question
    addShortAnswerBtn.addEventListener('click', () => {
        const questionsList = document.getElementById('questionsList');
        const shortAnswerCard = document.createElement('div');
        shortAnswerCard.className = 'question-card';
        shortAnswerCard.innerHTML = `
            <div class="form-group">
                <textarea class="question-text" placeholder="Enter your question"></textarea>
                <div class="answer-space">
                    <textarea class="answer-text" placeholder="Enter expected answer"></textarea>
                </div>
                <button class="btn-remove">
                    <span class="material-icons">delete</span>
                    Remove Question
                </button>
            </div>
        `;
        
        // Add the question card to the list
        questionsList.appendChild(shortAnswerCard);
        
        // Add remove functionality
        const removeButton = shortAnswerCard.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => {
            shortAnswerCard.remove();
        });
    });

    // Generate PDF
    generatePDFBtn.addEventListener('click', async () => {
        // Validate exam name
        const examNameField = document.querySelector('#examName');
        if (!examNameField.value.trim()) {
            alert('Please enter an exam name');
            examNameField.focus();
            return;
        }

        // Create a temporary div for PDF content
        const pdfContent = document.createElement('div');
        pdfContent.style.padding = '40px';
        pdfContent.style.fontFamily = 'Source Sans Pro, Arial, sans-serif';
        pdfContent.style.maxWidth = '800px';
        pdfContent.style.margin = '0 auto';
        pdfContent.style.backgroundColor = 'white';

        // Add header
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '40px';
        header.style.borderBottom = '2px solid #1976d2';
        header.style.paddingBottom = '20px';

        // Get exam name value
        const examName = examNameField.value;
        
        // Add exam name as title if it exists
        if (examName) {
            header.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 24px; font-weight: 700; color: #333;">${examName}</span>
                </div>
            `;
        }

        // Get all other fields and their values
        const fields = Array.from(examFieldsList.querySelectorAll('.field-row'));
        const fieldContent = fields.map(field => {
            const fieldName = field.querySelector('.field-name').value;
            const fieldValue = field.querySelector('.field-value, .form-control').value;
            // Skip the exam name field
            if (fieldName === 'Exam Name') return '';
            if (fieldValue) {
                return `
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #333; font-size: 16px;">${fieldName}:</span>
                        <span style="color: #555; font-size: 16px; margin-left: 8px;">${fieldValue}</span>
                    </div>
                `;
            }
            return '';
        }).filter(content => content).join('');

        header.innerHTML += fieldContent;
        pdfContent.appendChild(header);

        // Add questions
        const questions = document.querySelectorAll('.question-card');
        questions.forEach((question, index) => {
            const questionText = question.querySelector('.question-text').value;
            const options = Array.from(question.querySelectorAll('.option'));
            const answerText = question.querySelector('.answer-text');
            
            const questionDiv = document.createElement('div');
            questionDiv.style.marginBottom = '30px';
            
            if (options.length > 0) {
                // MCQ Question
                const layoutToggle = question.querySelector('.options-layout');
                const isSingleLine = layoutToggle ? !layoutToggle.checked : true; // Default to single line if toggle not found
                
                if (isSingleLine) {
                    // Single line format
                    questionDiv.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                <span style="font-weight: 600;">${index + 1}.</span> ${questionText}
                            </p>
                        </div>
                        <div style="margin-left: 20px; display: flex; gap: 20px; flex-wrap: wrap;">
                            <p style="color: #555; font-size: 15px;">A) ${options[0].value}</p>
                            <p style="color: #555; font-size: 15px;">B) ${options[1].value}</p>
                            <p style="color: #555; font-size: 15px;">C) ${options[2].value}</p>
                            <p style="color: #555; font-size: 15px;">D) ${options[3].value}</p>
                        </div>
                    `;
                } else {
                    // Multiple lines format
                    questionDiv.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                <span style="font-weight: 600;">${index + 1}.</span> ${questionText}
                            </p>
                        </div>
                        <div style="margin-left: 20px;">
                            <p style="color: #555; font-size: 15px; margin-bottom: 8px;">A) ${options[0].value}</p>
                            <p style="color: #555; font-size: 15px; margin-bottom: 8px;">B) ${options[1].value}</p>
                            <p style="color: #555; font-size: 15px; margin-bottom: 8px;">C) ${options[2].value}</p>
                            <p style="color: #555; font-size: 15px; margin-bottom: 8px;">D) ${options[3].value}</p>
                        </div>
                    `;
                }
            } else {
                // Short Answer Question
                questionDiv.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            <span style="font-weight: 600;">${index + 1}.</span> ${questionText}
                        </p>
                    </div>
                    <div style="margin-left: 20px;">
                        <div style="border-bottom: 1px solid #ccc; min-height: 100px; margin-bottom: 20px;">
                            <p style="color: #555; font-size: 15px; margin-bottom: 8px;">Answer:</p>
                            <div style="height: 80px;"></div>
                        </div>
                    </div>
                `;
            }
            pdfContent.appendChild(questionDiv);
        });

        // Add to body temporarily
        document.body.appendChild(pdfContent);

        try {
            // Generate PDF using html2canvas and jsPDF
            const canvas = await html2canvas(pdfContent, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            // Center the content on the page
            const x = (pdfWidth - imgWidth * ratio) / 2;
            const y = 20; // Top margin
            
            pdf.addImage(imgData, 'PNG', x, y, imgWidth * ratio, imgHeight * ratio);
            
            // Use exam name for filename, or use default
            pdf.save(`${examName || 'question-paper'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }

        // Remove temporary content
        document.body.removeChild(pdfContent);
    });
}); 