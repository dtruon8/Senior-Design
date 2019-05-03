# AAC Diagnostic Tool
Project for LSU Senior Design 2018-2019

## Table of Contents
> 1. [Introduction](#introduction)
> 2. [User Manual](#user-manual)
> 3. [Technical Details](#technical-details)
> 4. [Modifying the Assessment](#modifying-the-assessment)
> 5. [Additional Notes](#additional-notes)




## Introduction
The web app can be accessed only on the LSU wifi at capstone.ece.lsu.edu due to the server only being hosted by LSU. 

Currently, the web application is using the code in the 'pub' folder. This includes the home, assessment, and assessment summary page. Tentatively, the web app was going to have the login, registration, and password recovery features, but due to time constraints and a bad team composition, we failed in our endeavors. Also, we had the idea of creating an algorithm for assigning a patient to an AAC device from the selected assessment answers, but that also did not work out. For next year's LSU Senior Design Class, we would like this project to flourish and be the best it could be to help Speech-Language Pathologists in the diagnostic process for assigning an appropriate AAC device for their patients. Below is the user manual for the web app. 

## User Manual

### Home Page:
<img src="/images/home.PNG" alt="Home Page" width=350>

Here, the user can either begin a new AAC assessment or upload a previously-saved file to resume an assessment. If the user uploads an invalid file, an error message is displayed in red. Clicking the *Start AAC Assessment* button brings the user to the **AAC Assessment Page.**

### AAC Assessment Page:
<img src="/images/assessment.PNG" alt="Assessment Page" width=500>

In the middle of this page is the AAC assessment. There are six required sections, with the **Comments** section being optional. The user can select a section using the buttons at the left, and the current section's questions appear to the right. As questions are answered, the progress bar under the section name fills. Once all required questions in a section are answered, a checkmark appears next to the section name at the left. The types of questions include radio buttons, checkboxes, dropdown/select, and text input. In addition, some questions are not required unless a particular answer is chosen to a previous question. Once all required questions across each section has been answered, the *Submit* button at the bottom becomes clickable, allowing the user to access the **Summary Page.**

In addition to the assessment, there is a timer on the page, showing the time that has elapsed since the assessment began. The timer can be paused and resumed using the buttons below it. There is a *Save* button, allowing the user to save a text file that contains the input text and IDs of the answered questions. The user can upload this file on the **Home Page** to continue from where they left off. Note that on mobile devices (or iOS devices, at least), the process of saving the file is different. It is detailed below in the [Additional Notes](#additional-notes) section.

### AAC Assessment Summary Page:
<img src="/images/summary.PNG" alt="Summary Page" width=350>

On this page, the user can save a PDF summary of the selected answers and their input text answers by clicking the *Save Assessment Summary* button. The user can also return to the **Home Page** by clicking the *Home* button.

## Technical Details
To track progress, the app uses the arrays `numQs`, `numberAnswered`, and `questionAnswered`. Each element in `numQs` represents the number of required questions in a section of the assessment. `numberAnswered`'s elements are the number of required questions that have been answered in a section. `questionAnswered` is a two-dimensional array that keeps track of whether a particular question in a section has been answered. It only includes the required and conditionally-required questions, and not the optional questions.

Each answer is identified by its section and question number using the HTML `id` attribute. The `id` of all required questions is of the form `sXqYZ`, where X is a section number 1-6; Y is a one- or two-digit number; and Z is `a#` for non-text `input` or `select` HTML elements or `c` for text `input` or `textarea` elements. One sample `id` is `s2q1a4`, which is a `select` dropdown answer of question 1 in section 2 (the **Communication** section); another is `s1q5c` for the `textarea` input of question 5 in section 1 (the **Motor Skills** section). 

> Note that in section 6 (the **Audiological Status** section), the question numbers in the `id`s do not line up with the order questions are presented in. Instead, the numbering of text-based input questions starts at 20, after the last non-text question in the section. The `id`s could be changed, but references to the specific `id`s of the text answers must be changed in the JavaScript files.

When an answer is selected, the indices of the `questionAnswered` are determined using the `id`. If the element of `questionAnswered` for that question is `false`, it is changed to `true` and `numberAnswered` incremented. Next, the `changeBar` function is called. It updates the current length of the section's progress bar and the bar's text and if all questions in that section are answered, the checkmark next to the section name is displayed. Finally, it calls `checkCompletion` to determine if all required questions in the entire assessment have been answered. If so, the *Submit* button on the **Assessment Page** becomes available to click. 

When the *Save* button is clicked, the `id`s of all selected answers, along with the timer's current value, are put into a string variable. Any text questions which have been answered also have their values added to the string. Finally, the string is saved to a text file.

The app makes use of the browser's sessionStorage for the file upload and summary features. After a valid file has been uploaded on the **Home Page**, its contents are read and put into sessionStorage. It also sets the `uploadSuccessful` key in storage. On the **Assessment Page**, the app initializes variables with the `initialize` function and if `uploadSuccessful` is in storage, the contents of sessionStorage are read and the answers from storage are selected.

When the *Submit* button on the **Assessment Page** is pressed, the `id`s of the selected answers and all input text is put into sessionStorage. On the **Summary Page**, before loading all answers are present in a hidden `div` tag. The answers whose `id`s are not present in storage are removed and the text is added to the page from storage. When the user clicks the `Save Assessment Summary` button, a PDF is generated from the HTML in the hidden `div` tag. This is done using jsPDF.

## Modifying the Assessment

## Additional Notes
### Saving Assessment Progress Text File on Mobile Devices
On mobile devices (or maybe just Apple devices? We couldn't test on other mobile devices), the procedure for saving the text file is:
    
> 1. On the assessment page, click "Save" at the top right.
> 2. You will be brought to a page containing the text from the file.
> 3. Highlight all of the text.
> 4. Click "Share..."
> 5. Save the file to the desired location. The easiest way would be to click "Save to Files" and save it to iCloud Drive.

The procedure for resuming an assessment:

> 1. On the Home Page, click the file upload button ("Choose File" on Apple devices). 
> 2. Click "Browse" and browse to the location where a saved assessment text file is. 
> 3. Choose the desired file. 
> 4. Click "Start AAC Assessment" button

### Known Issues
* In the summary PDF, if the first line on a new page is an answer to a question, it is aligned to the left of the page rather than the proper alignment.
<img src="/images/unaligned.PNG" alt="Unaligned Answer in PDF">

* On iOS devices, the table headers don't stick when scrolling. This is likely due to different handling of the `position: sticky` CSS property. It may be possible to fix this by applying the `position: sticky` to the `thead` element rather than the individual `th` elements.
	
