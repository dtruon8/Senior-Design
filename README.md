# Senior-Design
AAC Diagnostic Tool

The web app can be accessed only on the LSU wifi at capstone.ece.lsu.edu due to the server only being hosted by LSU. 

Currently, the web application is using the code in the 'pub' folder. This includes the home, assessment, and assessment summary page. Tentatively, the web app was going to have the login, registration, and password recovery features, but due to time constraints and a bad team composition, we failed in our endeavors. Also, we had the idea of creating an algorithm for assigning a patient to an AAC device from the selected assessment answers, but that also did not work out. For next year's LSU Senior Design Class, we would like this project to flourish and be the best it could be to help Speech-Language Pathologists in the diagnostic process for assigning an appropriate AAC device for their patients. Below is the user manual for the web app. 

## User Manual

### Home Page:
<img src="/images/home.PNG" alt="Home Page" width=300>

Here, the user can either begin a new AAC assessmnt or upload a previously-saved file to resume an assessment. If the user uploads an invalid file, an error message is displayed in red.

### AAC Assessment Page:
<img src="/images/assessment.PNG" alt="Assessment Page" width=400>

On this page is the AAC assessment. In the middle of the page is the AAC assessment. There are six required sections, with the Comments section being optional. The user can select a section using the buttons at the left, and the current section's questions appear to the right. As questions are answered, the progress bar under the section name fills. Once all required questions in a section are answered, a checkmark appears at the left next to the section name. The types of questions include radio buttons, checkboxes, dropdown/select, and text input. In addition, some questions are not required unless a particular answer is chosen to a previous question. Once all required questions across each section has been answered, the "Submit" button at the bottom becomes clickable, allowing the user to access the Summary page.

In addition to the assessment, there is a timer on the page, showing the time that has elapsed since the assessment began. The timer can be paused and resumed using the buttons below it. There is a save button, allowing the user to save a text file that contains the input text and IDs of the answered questions. This file can be uploaded on the Home page to continue from where they left off. Note that on mobile devices (or iOS devices, at least), the process of saving the file is different. It is detailed below in the Additional Notes section.

### AAC Assessment Summary Page:
<img src="/images/summary.PNG" alt="Summary Page" width=300>

On this page, the user can save a PDF summary of the selected answers and their input text answers by clicking the "Save Assessment Summary" button. The user can also return to the Home page by clicking the "Home" button.

